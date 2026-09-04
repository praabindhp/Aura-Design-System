import type { HTMLAttributes, PropsWithChildren } from "react";
import { cx } from "../types.js";
import styles from "./layout.module.css";

type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 8;
type Columns = 1 | 2 | 3 | 4;

const gapClass = (gap: Gap) => styles[`gap${gap}`];

export function Box({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.box, className)} {...props} />;
}

export function Stack({
  className,
  gap = 4,
  ...props
}: HTMLAttributes<HTMLDivElement> & { readonly gap?: Gap }) {
  return <div className={cx(styles.stack, gapClass(gap), className)} {...props} />;
}

export function Inline({
  className,
  gap = 3,
  ...props
}: HTMLAttributes<HTMLDivElement> & { readonly gap?: Gap }) {
  return <div className={cx(styles.inline, gapClass(gap), className)} {...props} />;
}

export function Grid({
  className,
  collapse = true,
  columns = 1,
  gap = 4,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  readonly collapse?: boolean;
  readonly columns?: Columns;
  readonly gap?: Gap;
}) {
  return (
    <div
      className={cx(styles.grid, styles[`columns${columns}`], gapClass(gap), className)}
      data-collapse={collapse}
      {...props}
    />
  );
}

export function Container({
  children,
  className,
  size = "lg",
}: PropsWithChildren<{
  readonly className?: string;
  readonly size?: "sm" | "md" | "lg" | "xl";
}>) {
  return (
    <div className={cx(styles.container, className)} data-size={size}>
      {children}
    </div>
  );
}
