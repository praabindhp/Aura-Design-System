import type { ChartTone } from "../types.js";
import styles from "../charts.module.css";

export interface LegendItem {
  readonly key: string;
  readonly label: string;
  readonly value?: string;
  readonly tone: ChartTone;
  readonly pattern?: number;
}

interface LegendProps {
  readonly items: readonly LegendItem[];
}

export function Legend({ items }: LegendProps) {
  return (
    <ul className={styles.legend} aria-hidden="true">
      {items.map((item) => (
        <li className={styles.legendItem} key={item.key}>
          <span
            className={styles.legendMark}
            data-pattern={item.pattern}
            data-tone={item.tone}
          />
          <span className={styles.legendLabel}>{item.label}</span>
          {item.value ? (
            <strong className={styles.legendValue}>{item.value}</strong>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
