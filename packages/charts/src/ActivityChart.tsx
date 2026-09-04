import type { ActivityPoint, ActivitySeries, ChartCommonProps } from "./types.js";
import { ChartFrame } from "./internal/ChartFrame.js";
import { Legend } from "./internal/Legend.js";
import { defaultTones, finiteNonNegative, toneAt } from "./internal/chart-utils.js";
import styles from "./charts.module.css";

export interface ActivityChartProps extends ChartCommonProps {
  readonly points: readonly ActivityPoint[];
  readonly series: readonly ActivitySeries[];
  readonly valueLabel?: string;
}

const geometry = {
  height: 270,
  top: 24,
  bottom: 216,
  horizontalPadding: 48,
  pointGap: 96,
} as const;

export function ActivityChart({
  points,
  series,
  valueLabel = "Value",
  valueFormatter = (value) => String(value),
  emptyMessage = "No activity available",
  ariaLabel,
  ...frameProps
}: ActivityChartProps) {
  const safePoints = points.map((point) => ({
    ...point,
    values: Object.fromEntries(
      series.map((item) => [item.key, finiteNonNegative(point.values[item.key] ?? 0)]),
    ),
  }));
  const maximum = Math.max(
    0,
    ...safePoints.flatMap((point) => Object.values(point.values)),
  );
  const width = Math.max(
    640,
    geometry.horizontalPadding * 2 +
      Math.max(1, safePoints.length - 1) * geometry.pointGap,
  );
  const plotHeight = geometry.bottom - geometry.top;
  const pointSpacing =
    safePoints.length > 1
      ? (width - geometry.horizontalPadding * 2) / (safePoints.length - 1)
      : 0;

  return (
    <ChartFrame
      {...frameProps}
      ariaLabel={ariaLabel}
      tableHeaders={[
        "Period",
        ...series.map((item) => `${item.label} (${valueLabel})`),
      ]}
      tableRows={safePoints.map((point) => [
        point.label,
        ...series.map((item) => valueFormatter(point.values[item.key] ?? 0)),
      ])}
    >
      {maximum === 0 || safePoints.length === 0 || series.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <>
          <div
            className={styles.plotScroller}
            role="region"
            aria-label={`${ariaLabel} plot`}
            tabIndex={0}
          >
            <svg
              className={styles.activitySvg}
              width={width}
              height={geometry.height}
              viewBox={`0 0 ${width} ${geometry.height}`}
              aria-hidden="true"
              focusable="false"
            >
              {[0, 1, 2, 3, 4].map((line) => {
                const y = geometry.top + (plotHeight * line) / 4;
                return (
                  <line
                    className={styles.gridLine}
                    key={line}
                    x1={geometry.horizontalPadding}
                    x2={width - geometry.horizontalPadding}
                    y1={y}
                    y2={y}
                  />
                );
              })}
              {series.map((item, seriesIndex) => {
                const pointsAttribute = safePoints
                  .map((point, pointIndex) => {
                    const value = point.values[item.key] ?? 0;
                    const x = geometry.horizontalPadding + pointIndex * pointSpacing;
                    const y = geometry.bottom - (value / maximum) * plotHeight;
                    return `${x},${y}`;
                  })
                  .join(" ");
                const tone = toneAt(item.tone, seriesIndex);
                return (
                  <g key={item.key}>
                    <polyline
                      className={styles.activityLine}
                      data-emphasis={item.emphasis ?? "primary"}
                      data-pattern={seriesIndex % 4}
                      data-tone={tone}
                      points={pointsAttribute}
                    />
                    {safePoints.map((point, pointIndex) => {
                      const value = point.values[item.key] ?? 0;
                      const x = geometry.horizontalPadding + pointIndex * pointSpacing;
                      const y = geometry.bottom - (value / maximum) * plotHeight;
                      return (
                        <circle
                          className={styles.activityPoint}
                          data-tone={tone}
                          key={`${point.label}-${pointIndex}-${item.key}`}
                          cx={x}
                          cy={y}
                          r={seriesIndex % 2 === 0 ? 5 : 4}
                        />
                      );
                    })}
                  </g>
                );
              })}
              {safePoints.map((point, index) => (
                <text
                  className={styles.axisText}
                  key={`${point.label}-${index}`}
                  x={geometry.horizontalPadding + index * pointSpacing}
                  y={geometry.bottom + 32}
                  textAnchor="middle"
                >
                  {point.label}
                </text>
              ))}
            </svg>
          </div>
          <Legend
            items={series.map((item, index) => ({
              key: item.key,
              label: item.label,
              tone: item.tone ?? defaultTones[index % defaultTones.length] ?? "neutral",
              pattern: index % 4,
            }))}
          />
        </>
      )}
    </ChartFrame>
  );
}
