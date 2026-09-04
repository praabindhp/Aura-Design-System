import type { HTMLAttributes, ReactNode } from "react";

export type ChartTone = "brand" | "info" | "success" | "warning" | "danger" | "neutral";

export interface ChartDatum {
  readonly id?: string;
  readonly label: string;
  readonly value: number;
  readonly displayValue?: string;
  readonly tone?: ChartTone;
  readonly description?: string;
}

export type ChartValueFormatter = (value: number) => string;

export interface ChartCommonProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "title"
> {
  /** A concise, unique description of the chart and its purpose. */
  readonly ariaLabel: string;
  readonly title?: string;
  readonly description?: string;
  readonly headingLevel?: 2 | 3 | 4;
  readonly emptyMessage?: string;
  readonly valueFormatter?: ChartValueFormatter;
}

export interface ChartGridProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
  readonly minimumColumnWidth?: "compact" | "standard" | "wide";
}

export interface ActivityPoint {
  readonly label: string;
  readonly values: Readonly<Record<string, number>>;
}

export interface ActivitySeries {
  readonly key: string;
  readonly label: string;
  readonly tone?: ChartTone;
  readonly emphasis?: "primary" | "secondary";
}
