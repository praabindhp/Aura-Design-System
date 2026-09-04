import type { ReactNode } from "react";
import { cx, type AuraIcon } from "../types.js";
import styles from "./settings.module.css";

export interface SettingsNavigationItem<Value extends string = string> {
  readonly disabled?: boolean;
  readonly icon: AuraIcon;
  readonly label: string;
  readonly value: Value;
}

export function SettingsLayout<Value extends string>({
  children,
  items,
  label = "Settings sections",
  onValueChange,
  value,
}: {
  readonly children: ReactNode;
  readonly items: ReadonlyArray<SettingsNavigationItem<Value>>;
  readonly label?: string;
  readonly onValueChange: (value: Value) => void;
  readonly value: Value;
}) {
  return (
    <div className={styles.layout}>
      <nav aria-label={label} className={styles.navigation}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              aria-current={item.value === value ? "page" : undefined}
              className={styles.navigationItem}
              disabled={item.disabled}
              key={item.value}
              type="button"
              onClick={() => onValueChange(item.value)}
            >
              <Icon aria-hidden size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div>{children}</div>
    </div>
  );
}

export function SettingsPanel({
  action,
  children,
  className,
  description,
  title,
}: {
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly description?: ReactNode;
  readonly title: ReactNode;
}) {
  return (
    <section className={cx(styles.panel, className)}>
      <header className={styles.panelHeader}>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </header>
      <div className={styles.panelBody}>{children}</div>
    </section>
  );
}

export function SettingsGroup({
  action,
  children,
  description,
  title,
}: {
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly description?: ReactNode;
  readonly title: ReactNode;
}) {
  return (
    <section className={styles.group}>
      <header className={styles.groupHeader}>
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {action}
      </header>
      <div className={styles.groupBody}>{children}</div>
    </section>
  );
}

export function SettingsRow({
  action,
  description,
  label,
}: {
  readonly action: ReactNode;
  readonly description?: ReactNode;
  readonly label: ReactNode;
}) {
  return (
    <div className={styles.row}>
      <div className={styles.rowContent}>
        <strong>{label}</strong>
        {description && <p>{description}</p>}
      </div>
      <div className={styles.rowAction}>{action}</div>
    </div>
  );
}
