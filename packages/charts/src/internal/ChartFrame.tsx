import { createElement, type ReactNode } from "react";

import type { ChartCommonProps } from "../types.js";
import { joinClassNames } from "./chart-utils.js";
import styles from "../charts.module.css";

interface ChartFrameProps extends Omit<
  ChartCommonProps,
  "emptyMessage" | "valueFormatter"
> {
  readonly children: ReactNode;
  readonly tableHeaders: readonly string[];
  readonly tableRows: ReadonlyArray<readonly ReactNode[]>;
}

export function ChartFrame({
  ariaLabel,
  title,
  description,
  headingLevel = 3,
  children,
  tableHeaders,
  tableRows,
  className,
  ...htmlProps
}: ChartFrameProps) {
  return (
    <figure {...htmlProps} className={joinClassNames(styles.frame, className)}>
      {title || description ? (
        <figcaption className={styles.caption}>
          {title
            ? createElement(`h${headingLevel}`, { className: styles.title }, title)
            : null}
          {description ? <p className={styles.description}>{description}</p> : null}
        </figcaption>
      ) : null}
      <div className={styles.visual}>{children}</div>
      <span className={styles.visuallyHidden} role="img" aria-label={ariaLabel} />
      <table className={styles.visuallyHidden}>
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={`${header}-${index}`} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={cellIndex} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
