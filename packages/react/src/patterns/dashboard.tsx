import { ArrowUpRight, Info, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, Progress, type StatusTone } from "../primitives/index.js";
import { cx, type AuraIcon } from "../types.js";
import styles from "./dashboard.module.css";

export interface PageHeaderProps {
  readonly actions?: ReactNode;
  readonly className?: string;
  readonly description?: ReactNode;
  readonly eyebrow?: string;
  readonly icon?: AuraIcon;
  readonly title: ReactNode;
}

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  icon: Icon,
  title,
}: PageHeaderProps) {
  return (
    <header className={cx(styles.pageHeader, className)}>
      <div className={styles.titleGroup}>
        {Icon && (
          <span aria-hidden className={styles.titleIcon}>
            <Icon size={19} />
          </span>
        )}
        <div>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>
      {actions && <div className={styles.pageActions}>{actions}</div>}
    </header>
  );
}

export function Section({
  action,
  children,
  className,
  description,
  flush = false,
  title,
}: {
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly description?: ReactNode;
  readonly flush?: boolean;
  readonly title: ReactNode;
}) {
  return (
    <section className={cx(styles.section, className)}>
      <header className={styles.sectionHeader}>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action && <div className={styles.sectionAction}>{action}</div>}
      </header>
      <div className={styles.sectionBody} data-flush={flush}>
        {children}
      </div>
    </section>
  );
}

export function CardGrid({
  children,
  className,
  columns = 3,
  label,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly columns?: 1 | 2 | 3 | 4;
  readonly label?: string;
}) {
  return (
    <div
      aria-label={label}
      className={cx(styles.cardGrid, className)}
      data-columns={columns}
    >
      {children}
    </div>
  );
}

export function ActionCard({
  description,
  disabled,
  icon: Icon,
  onClick,
  title,
}: {
  readonly description: ReactNode;
  readonly disabled?: boolean;
  readonly icon: AuraIcon;
  readonly onClick: () => void;
  readonly title: ReactNode;
}) {
  return (
    <button
      className={styles.actionCard}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      <span aria-hidden className={styles.actionIcon}>
        <Icon size={19} />
      </span>
      <span className={styles.actionContent}>
        <strong>{title}</strong>
        <p>{description}</p>
      </span>
      <span aria-hidden className={styles.actionArrow}>
        <ArrowUpRight size={16} />
      </span>
    </button>
  );
}

export function MetricCard({
  hint,
  hintTone,
  icon: Icon,
  label,
  value,
}: {
  readonly hint: ReactNode;
  readonly hintTone?: "neutral" | "success";
  readonly icon: AuraIcon;
  readonly label: string;
  readonly value: ReactNode;
}) {
  return (
    <article aria-label={label} className={styles.metricCard}>
      <header className={styles.metricHeader}>
        <span className={styles.metricLabel}>
          <Icon aria-hidden size={15} />
          {label}
        </span>
        <Info aria-hidden size={15} />
      </header>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricHint} data-tone={hintTone}>
        {hint}
      </div>
      <span aria-hidden className={styles.metricBars}>
        <i />
        <i />
        <i />
        <i />
      </span>
    </article>
  );
}

export function StatusBadge({
  children,
  icon: Icon,
  tone = "brand",
}: {
  readonly children: ReactNode;
  readonly icon?: AuraIcon;
  readonly tone?: StatusTone;
}) {
  return (
    <Badge icon={Icon ? <Icon aria-hidden size={13} /> : undefined} tone={tone}>
      {children}
    </Badge>
  );
}

export function UsageCard({
  current,
  label = "Monthly usage",
  max,
  unit,
}: {
  readonly current: number;
  readonly label?: string;
  readonly max: number;
  readonly unit: string;
}) {
  const safeMax = Math.max(max, 1);
  const percent = Math.min(100, Math.round((current / safeMax) * 100));
  const remaining = Math.max(0, max - current);
  return (
    <section aria-label={label} className={styles.usageCard}>
      <header className={styles.usageHeader}>
        <strong>
          <Zap aria-hidden color="var(--aura-brand-content)" size={15} />
          {label}
        </strong>
        <span>{percent}%</span>
      </header>
      <div className={styles.usageMeta}>
        <span>
          {current.toLocaleString()} / {max.toLocaleString()} {unit}
        </span>
      </div>
      <Progress label={`${label}: ${percent}% used`} value={percent} />
      <span className={styles.usageFooter}>
        {remaining.toLocaleString()} {unit} remaining
      </span>
    </section>
  );
}
