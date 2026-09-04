import type { ChartGridProps } from "./types.js";
import { joinClassNames } from "./internal/chart-utils.js";
import styles from "./charts.module.css";

export function ChartGrid({
  children,
  minimumColumnWidth = "standard",
  className,
  ...htmlProps
}: ChartGridProps) {
  return (
    <div
      {...htmlProps}
      className={joinClassNames(styles.grid, className)}
      data-minimum-column-width={minimumColumnWidth}
    >
      {children}
    </div>
  );
}
