import type { ChartCommonProps, ChartDatum } from "./types.js";
import { ChartFrame } from "./internal/ChartFrame.js";
import { Legend } from "./internal/Legend.js";
import {
  datumKey,
  displayValue,
  finiteNonNegative,
  toneAt,
} from "./internal/chart-utils.js";
import styles from "./charts.module.css";

export interface ColumnChartProps extends ChartCommonProps {
  readonly data: readonly ChartDatum[];
  readonly valueLabel?: string;
  readonly showLegend?: boolean;
}

const geometry = {
  height: 240,
  plotTop: 16,
  plotBottom: 190,
  columnWidth: 44,
  columnGap: 38,
  horizontalPadding: 44,
} as const;

export function ColumnChart({
  data,
  valueLabel = "Value",
  showLegend = true,
  valueFormatter = (value) => String(value),
  emptyMessage = "No data available",
  ariaLabel,
  ...frameProps
}: ColumnChartProps) {
  const cleanData = data.map((datum) => ({
    ...datum,
    value: finiteNonNegative(datum.value),
  }));
  const maximum = Math.max(0, ...cleanData.map(({ value }) => value));
  const width = Math.max(
    360,
    geometry.horizontalPadding * 2 +
      cleanData.length * (geometry.columnWidth + geometry.columnGap),
  );
  const plotHeight = geometry.plotBottom - geometry.plotTop;

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
        <>
          <div
            className={styles.plotScroller}
            role="region"
            aria-label={`${ariaLabel} plot`}
            tabIndex={0}
          >
            <svg
              className={styles.columnSvg}
              width={width}
              height={geometry.height}
              viewBox={`0 0 ${width} ${geometry.height}`}
              aria-hidden="true"
              focusable="false"
            >
              {[0, 1, 2, 3, 4].map((line) => {
                const y = geometry.plotTop + (plotHeight * line) / 4;
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
              {cleanData.map((datum, index) => {
                const barHeight = (datum.value / maximum) * plotHeight;
                const x =
                  geometry.horizontalPadding +
                  index * (geometry.columnWidth + geometry.columnGap) +
                  geometry.columnGap / 2;
                const y = geometry.plotBottom - barHeight;
                return (
                  <g key={datumKey(datum, index)}>
                    <rect
                      className={styles.chartMark}
                      data-tone={toneAt(datum.tone, index)}
                      x={x}
                      y={y}
                      width={geometry.columnWidth}
                      height={barHeight}
                      rx={8}
                    />
                    <text
                      className={styles.valueText}
                      x={x + geometry.columnWidth / 2}
                      y={Math.max(geometry.plotTop, y - 8)}
                      textAnchor="middle"
                    >
                      {displayValue(datum, valueFormatter)}
                    </text>
                    <text
                      className={styles.axisText}
                      x={x + geometry.columnWidth / 2}
                      y={geometry.plotBottom + 28}
                      textAnchor="middle"
                    >
                      {datum.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          {showLegend ? (
            <Legend
              items={cleanData.map((datum, index) => ({
                key: datumKey(datum, index),
                label: datum.label,
                value: displayValue(datum, valueFormatter),
                tone: toneAt(datum.tone, index),
              }))}
            />
          ) : null}
        </>
      )}
    </ChartFrame>
  );
}
