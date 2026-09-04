import type { ChartCommonProps, ChartTone } from "./types.js";
import { ChartFrame } from "./internal/ChartFrame.js";
import { percentage } from "./internal/chart-utils.js";
import styles from "./charts.module.css";

export interface RadialChartProps extends ChartCommonProps {
  readonly value: number;
  readonly label?: string;
  readonly tone?: ChartTone;
}

export function RadialChart({
  value,
  label = "used",
  tone = "brand",
  valueFormatter = (current) => `${current}%`,
  ...frameProps
}: RadialChartProps) {
  const safeValue = percentage(value);

  return (
    <ChartFrame
      {...frameProps}
      tableHeaders={["Measure", "Value"]}
      tableRows={[[label, valueFormatter(safeValue)]]}
    >
      <svg
        className={styles.radialSvg}
        viewBox="0 0 120 120"
        aria-hidden="true"
        focusable="false"
      >
        <circle className={styles.radialTrack} cx="60" cy="60" r="46" />
        <circle
          className={styles.radialIndicator}
          data-tone={tone}
          cx="60"
          cy="60"
          r="46"
          pathLength="100"
          strokeDasharray={`${safeValue} ${100 - safeValue}`}
        />
        <text className={styles.radialValue} x="60" y="59" textAnchor="middle">
          {valueFormatter(safeValue)}
        </text>
        <text className={styles.radialLabel} x="60" y="78" textAnchor="middle">
          {label}
        </text>
      </svg>
    </ChartFrame>
  );
}
