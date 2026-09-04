import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../types.js";
import styles from "./controls.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ControlSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  readonly endIcon?: ReactNode;
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
  readonly size?: ControlSize;
  readonly startIcon?: ReactNode;
  readonly variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled,
    endIcon,
    fullWidth,
    loading,
    size = "md",
    startIcon,
    type = "button",
    variant = "primary",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-busy={loading || undefined}
      className={cx(styles.button, fullWidth && styles.fullWidth, className)}
      data-size={size}
      data-variant={variant}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? <span aria-hidden className={styles.spinner} /> : startIcon}
      <span>{children}</span>
      {!loading && endIcon}
    </button>
  );
});

export interface IconButtonProps extends Omit<
  ButtonProps,
  "children" | "endIcon" | "fullWidth" | "startIcon"
> {
  readonly children: ReactNode;
  readonly label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      children,
      className,
      disabled,
      label,
      loading,
      size = "md",
      variant = "secondary",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        aria-busy={loading || undefined}
        aria-label={label}
        className={cx(styles.iconButton, className)}
        data-size={size}
        data-variant={variant}
        disabled={disabled || loading}
        type="button"
        {...props}
      >
        {loading ? <span aria-hidden className={styles.spinner} /> : children}
      </button>
    );
  },
);

export interface LinkButtonProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "color"
> {
  readonly endIcon?: ReactNode;
  readonly fullWidth?: boolean;
  readonly size?: ControlSize;
  readonly startIcon?: ReactNode;
  readonly variant?: ButtonVariant;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    {
      children,
      className,
      endIcon,
      fullWidth,
      size = "md",
      startIcon,
      variant = "primary",
      ...props
    },
    ref,
  ) {
    return (
      <a
        ref={ref}
        className={cx(styles.linkButton, fullWidth && styles.fullWidth, className)}
        data-size={size}
        data-variant={variant}
        {...props}
      >
        {startIcon}
        <span>{children}</span>
        {endIcon}
      </a>
    );
  },
);

export function Spinner({ label = "Loading" }: { readonly label?: string }) {
  return <span aria-label={label} className={styles.spinner} role="status" />;
}
