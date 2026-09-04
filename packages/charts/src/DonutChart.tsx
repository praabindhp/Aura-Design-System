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

export interface DonutChartProps extends ChartCommonProps {
  readonly data: readonly ChartDatum[];
  readonly centerLabel?: string;
  readonly centerValue?: string;
  readonly valueLabel?: string;
}

interface Point {
  readonly x: number;
  readonly y: number;
}

interface Segment {
  readonly datum: ChartDatum;
  readonly index: number;
  readonly start: number;
  readonly end: number;
}

function polarPoint(angle: number, radius: number): Point {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: 100 + radius * Math.cos(radians),
    y: 100 + radius * Math.sin(radians),
  };
}

function segmentPath(startAngle: number, endAngle: number): string {
  const safeEnd = endAngle - Math.min(0.5, (endAngle - startAngle) / 8);
  const start = polarPoint(startAngle, 72);
  const end = polarPoint(safeEnd, 72);
  const innerEnd = polarPoint(safeEnd, 46);
  const innerStart = polarPoint(startAngle, 46);
  const largeArc = safeEnd - startAngle > 180 ? 1 : 0;

  return [
    `M ${start.x} ${start.y}`,
    `A 72 72 0 ${largeArc} 1 ${end.x} ${end.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A 46 46 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

function createSegments(
  data: readonly ChartDatum[],
  total: number,
): readonly Segment[] {
  const segments: Segment[] = [];
  let start = 0;

  data.forEach((datum, index) => {
    const end = total === 0 ? 0 : start + (datum.value / total) * 360;
    segments.push({ datum, index, start, end });
    start = end;
  });

  return segments;
}

export function DonutChart({
  data,
  centerLabel = "Total",
  centerValue,
  valueLabel = "Value",
  valueFormatter = (value) => String(value),
  emptyMessage = "No data available",
  ...frameProps
}: DonutChartProps) {
  const cleanData = data.map((datum) => ({
    ...datum,
    value: finiteNonNegative(datum.value),
  }));
  const total = cleanData.reduce((sum, datum) => sum + datum.value, 0);
  const segments = createSegments(cleanData, total);

  return (
    <ChartFrame
      {...frameProps}
      tableHeaders={["Category", valueLabel, "Details"]}
      tableRows={cleanData.map((datum) => [
        datum.label,
        displayValue(datum, valueFormatter),
        datum.description ?? "",
      ])}
    >
      {total === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <div className={styles.donutLayout}>
          <svg
            className={styles.donutSvg}
            viewBox="0 0 200 200"
            aria-hidden="true"
            focusable="false"
          >
            {segments.map(({ datum, index, start, end }) => {
              return datum.value > 0 ? (
                <path
                  className={styles.chartMark}
                  data-tone={toneAt(datum.tone, index)}
                  d={segmentPath(start, end)}
                  key={datumKey(datum, index)}
                />
              ) : null;
            })}
            <text className={styles.donutValue} x="100" y="96" textAnchor="middle">
              {centerValue ?? valueFormatter(total)}
            </text>
            <text className={styles.donutLabel} x="100" y="118" textAnchor="middle">
              {centerLabel}
            </text>
          </svg>
          <Legend
            items={cleanData.map((datum, index) => ({
              key: datumKey(datum, index),
              label: datum.label,
              value: displayValue(datum, valueFormatter),
              tone: toneAt(datum.tone, index),
            }))}
          />
        </div>
      )}
    </ChartFrame>
  );
}
