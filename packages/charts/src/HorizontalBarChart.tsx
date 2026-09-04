import type { ChartCommonProps, ChartDatum } from "./types.js";
import { ChartFrame } from "./internal/ChartFrame.js";
import {
  datumKey,
  displayValue,
  finiteNonNegative,
  toneAt,
} from "./internal/chart-utils.js";
import styles from "./charts.module.css";

export interface HorizontalBarChartProps extends ChartCommonProps {
  readonly data: readonly ChartDatum[];
  readonly valueLabel?: string;
}

const geometry = {
  width: 760,
  labelWidth: 190,
  valueWidth: 92,
  plotWidth: 430,
  rowHeight: 54,
  barHeight: 18,
  verticalPadding: 18,
} as const;

export function HorizontalBarChart({
  data,
  valueLabel = "Value",
  valueFormatter = (value) => String(value),
  emptyMessage = "No data available",
  ariaLabel,
  ...frameProps
}: HorizontalBarChartProps) {
  const cleanData = data.map((datum) => ({
    ...datum,
    value: finiteNonNegative(datum.value),
  }));
  const maximum = Math.max(0, ...cleanData.map(({ value }) => value));
  const height = Math.max(
    160,
    geometry.verticalPadding * 2 + cleanData.length * geometry.rowHeight,
  );

  return (
    <ChartFrame
      {...frameProps}
      ariaLabel={ariaLabel}
      tableHeaders={["Category", valueLabel, "Details"]}
      tableRows={cleanData.map((datum) => [
        datum.label,
        displayValue(datum, valueFormatter),
        datum.description ?? "",
      ])}
    >
      {maximum === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <div
          className={styles.plotScroller}
          role="region"
          aria-label={`${ariaLabel} plot`}
          tabIndex={0}
        >
          <svg
            className={styles.horizontalSvg}
            width={geometry.width}
            height={height}
            viewBox={`0 0 ${geometry.width} ${height}`}
            aria-hidden="true"
            focusable="false"
          >
            {cleanData.map((datum, index) => {
              const y =
                geometry.verticalPadding +
                index * geometry.rowHeight +
                (geometry.rowHeight - geometry.barHeight) / 2;
              const barWidth = (datum.value / maximum) * geometry.plotWidth;
              return (
                <g key={datumKey(datum, index)}>
                  <text
                    className={styles.barLabel}
                    x={0}
                    y={y + geometry.barHeight - 3}
                  >
                    {datum.label}
                  </text>
                  <rect
                    className={styles.barTrack}
                    x={geometry.labelWidth}
                    y={y}
                    width={geometry.plotWidth}
                    height={geometry.barHeight}
                    rx={9}
                  />
                  <rect
                    className={styles.chartMark}
                    data-tone={toneAt(datum.tone, index)}
                    x={geometry.labelWidth}
                    y={y}
                    width={barWidth}
                    height={geometry.barHeight}
                    rx={9}
                  />
                  <text
                    className={styles.barValue}
                    x={geometry.labelWidth + geometry.plotWidth + geometry.valueWidth}
                    y={y + geometry.barHeight - 3}
                    textAnchor="end"
                  >
                    {displayValue(datum, valueFormatter)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </ChartFrame>
  );
}
