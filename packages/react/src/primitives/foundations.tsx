import type { HTMLAttributes, PropsWithChildren } from "react";
import { cx } from "../types.js";
import styles from "./foundations.module.css";

export function Heading({
  children,
  className,
  level = 2,
  size = "md",
}: PropsWithChildren<{
  readonly className?: string;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
  readonly size?: "sm" | "md" | "lg";
}>) {
  const Component = `h${level}` as const;
  return (
    <Component className={cx(styles.heading, className)} data-size={size}>
      {children}
    </Component>
  );
}

export function Text({
  as: Component = "p",
  className,
  size = "md",
  tone = "primary",
  ...props
}: HTMLAttributes<HTMLElement> & {
  readonly as?: "p" | "span" | "div";
  readonly size?: "sm" | "md" | "lg";
  readonly tone?: "primary" | "secondary" | "muted";
}) {
  return (
    <Component
      className={cx(styles.text, className)}
      data-size={size}
      data-tone={tone}
      {...props}
    />
  );
}

export function Code({ children }: PropsWithChildren) {
  return <code className={styles.code}>{children}</code>;
}

export function Kbd({ children }: PropsWithChildren) {
  return <kbd className={styles.kbd}>{children}</kbd>;
}

export function Surface({
  className,
  elevation = "flat",
  interactive = false,
  padding = "md",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  readonly elevation?: "flat" | "raised";
  readonly interactive?: boolean;
  readonly padding?: "none" | "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cx(styles.surface, className)}
      data-elevation={elevation}
      data-interactive={interactive}
      data-padding={padding}
      {...props}
    />
  );
}

export function Divider({ className }: { readonly className?: string }) {
  return <hr className={cx(styles.divider, className)} />;
}

export function VisuallyHidden({ children }: PropsWithChildren) {
  return <span className={styles.visuallyHidden}>{children}</span>;
}
