import type { Key, ReactNode } from "react";
import { cx } from "../types.js";
import styles from "./data-display.module.css";

export interface DataTableColumn<Row> {
  readonly align?: "start" | "center" | "end";
  readonly cell: (row: Row) => ReactNode;
  readonly header: ReactNode;
  readonly key: string;
}

export function DataTable<Row>({
  caption,
  columns,
  getRowKey,
  rows,
}: {
  readonly caption: string;
  readonly columns: ReadonlyArray<DataTableColumn<Row>>;
  readonly getRowKey: (row: Row) => Key;
  readonly rows: ReadonlyArray<Row>;
}) {
  return (
    <div className={styles.tableRegion} role="region" aria-label={caption} tabIndex={0}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th data-align={column.align} key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td data-align={column.align} key={column.key}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface DescriptionItem {
  readonly label: ReactNode;
  readonly value: ReactNode;
}

export function DescriptionList({
  className,
  columns = 1,
  items,
}: {
  readonly className?: string;
  readonly columns?: 1 | 2 | 3;
  readonly items: ReadonlyArray<DescriptionItem>;
}) {
  return (
    <dl className={cx(styles.descriptionList, className)} data-columns={columns}>
      {items.map((item, index) => (
        <div className={styles.descriptionItem} key={index}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Stat({
  hint,
  label,
  value,
}: {
  readonly hint?: ReactNode;
  readonly label: ReactNode;
  readonly value: ReactNode;
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <strong className={styles.statValue}>{value}</strong>
      {hint && <span className={styles.statHint}>{hint}</span>}
    </div>
  );
}
