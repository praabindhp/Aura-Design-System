import type { PropsWithChildren, ReactNode } from "react";
import { cx } from "../types.js";
import styles from "./status.module.css";

export type StatusTone =
  "brand" | "neutral" | "success" | "warning" | "danger" | "info";

export function Badge({
  children,
  className,
  icon,
  tone = "brand",
}: PropsWithChildren<{
  readonly className?: string;
  readonly icon?: ReactNode;
  readonly tone?: StatusTone;
}>) {
  return (
    <span className={cx(styles.badge, className)} data-tone={tone}>
      {icon}
      {children}
    </span>
  );
}

export function Progress({
  className,
  label,
  max = 100,
  value,
}: {
  readonly className?: string;
  readonly label: string;
  readonly max?: number;
  readonly value: number;
}) {
  const safeValue = Math.min(Math.max(value, 0), max);
  return (
    <progress
      aria-label={label}
      className={cx(styles.progress, className)}
      max={max}
      value={safeValue}
    />
  );
}

export function Skeleton({
  className,
  label = "Loading content",
  size = "sm",
  variant = "line",
}: {
  readonly className?: string;
  readonly label?: string;
  readonly size?: "sm" | "md" | "lg";
  readonly variant?: "line" | "block" | "circle";
}) {
  return (
    <span
      aria-label={label}
      className={cx(styles.skeleton, className)}
      data-size={size}
      data-variant={variant}
      role="status"
    />
  );
}
