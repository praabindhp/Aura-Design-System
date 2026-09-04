import {
  AlertCircle,
  CheckCircle2,
  CircleAlert,
  Info,
  Inbox,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useId, type ReactElement, type ReactNode } from "react";
import {
  AntApp,
  AntDrawer,
  AntModal,
  AntPopconfirm,
  AntTooltip,
} from "../internal/antd.js";
import { Button, Spinner } from "../primitives/index.js";
import { cx } from "../types.js";
import styles from "./feedback.module.css";

export type FeedbackTone = "info" | "success" | "warning" | "danger";

const toneIcon = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
} as const;

export function Alert({
  action,
  className,
  description,
  dismissLabel = "Dismiss notification",
  onDismiss,
  title,
  tone = "info",
}: {
  readonly action?: ReactNode;
  readonly className?: string;
  readonly description?: ReactNode;
  readonly dismissLabel?: string;
  readonly onDismiss?: () => void;
  readonly title: ReactNode;
  readonly tone?: FeedbackTone;
}) {
  const Icon = toneIcon[tone];
  return (
    <div
      className={cx(styles.alert, className)}
      data-tone={tone}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Icon aria-hidden size={18} />
      <div>
        <div className={styles.alertTitle}>{title}</div>
        {description && <div className={styles.alertDescription}>{description}</div>}
        {action}
      </div>
      {onDismiss && (
        <button
          aria-label={dismissLabel}
          className={styles.dismiss}
          type="button"
          onClick={onDismiss}
        >
          <X aria-hidden size={16} />
        </button>
      )}
    </div>
  );
}

function State({
  action,
  description,
  icon,
  title,
  tone = "brand",
}: {
  readonly action?: ReactNode;
  readonly description: ReactNode;
  readonly icon: ReactNode;
  readonly title: ReactNode;
  readonly tone?: "brand" | "danger";
}) {
  return (
    <div className={styles.state} data-tone={tone}>
      <div className={styles.stateContent}>
        <span aria-hidden className={styles.stateIcon}>
          {icon}
        </span>
        <h2>{title}</h2>
        <p>{description}</p>
        {action && <div className={styles.stateAction}>{action}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  action,
  description,
  icon = <Inbox size={22} />,
  title,
}: {
  readonly action?: ReactNode;
  readonly description: ReactNode;
  readonly icon?: ReactNode;
  readonly title: ReactNode;
}) {
  return <State action={action} description={description} icon={icon} title={title} />;
}

export function ErrorState({
  description,
  onRetry,
  retryLabel = "Try again",
  title = "Something went wrong",
}: {
  readonly description: ReactNode;
  readonly onRetry?: () => void;
  readonly retryLabel?: string;
  readonly title?: ReactNode;
}) {
  const action = onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : undefined;
  return (
    <State
      action={action}
      description={description}
      icon={<CircleAlert size={22} />}
      title={title}
      tone="danger"
    />
  );
}

export function LoadingState({ label = "Loading" }: { readonly label?: string }) {
  return (
    <div className={styles.loading}>
      <Spinner label={label} />
      <span>{label}</span>
    </div>
  );
}

export interface DialogProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly description?: ReactNode;
  readonly footer?: ReactNode;
  readonly onClose: () => void;
  readonly open: boolean;
  readonly title: ReactNode;
  readonly width?: "sm" | "md" | "lg";
}

const dialogWidth = {
  sm: "var(--aura-dialog-width-sm)",
  md: "var(--aura-dialog-width-md)",
  lg: "var(--aura-dialog-width-lg)",
} as const;

export function Dialog({
  children,
  className,
  description,
  footer,
  onClose,
  open,
  title,
  width = "md",
}: DialogProps) {
  const descriptionId = useId();
  const describePanel = useCallback(
    (panel: HTMLDivElement | null) => {
      if (!panel) return;
      if (description) panel.setAttribute("aria-describedby", descriptionId);
      else panel.removeAttribute("aria-describedby");
    },
    [description, descriptionId],
  );
  return (
    <AntModal
      centered
      destroyOnHidden
      footer={footer ?? null}
      open={open}
      panelRef={describePanel}
      title={title}
      width={dialogWidth[width]}
      onCancel={onClose}
      {...(className ? { className } : {})}
      {...(styles.modal ? { rootClassName: styles.modal } : {})}
    >
      {description && <p id={descriptionId}>{description}</p>}
      {children}
    </AntModal>
  );
}

export function Drawer({
  children,
  onClose,
  open,
  placement = "right",
  title,
}: {
  readonly children: ReactNode;
  readonly onClose: () => void;
  readonly open: boolean;
  readonly placement?: "left" | "right" | "top" | "bottom";
  readonly title: ReactNode;
}) {
  return (
    <AntDrawer
      open={open}
      placement={placement}
      title={title}
      onClose={onClose}
      {...(styles.drawer ? { className: styles.drawer } : {})}
    >
      {children}
    </AntDrawer>
  );
}

export function Tooltip({
  children,
  content,
  placement = "top",
}: {
  readonly children: ReactElement;
  readonly content: ReactNode;
  readonly placement?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <AntTooltip
      placement={placement}
      title={content}
      trigger={["hover", "focus"]}
      {...(styles.tooltip ? { rootClassName: styles.tooltip } : {})}
    >
      {children}
    </AntTooltip>
  );
}

export function Confirm({
  cancelLabel = "Cancel",
  children,
  confirmLabel = "Confirm",
  description,
  onConfirm,
  title,
  tone = "primary",
}: {
  readonly cancelLabel?: string;
  readonly children: ReactElement;
  readonly confirmLabel?: string;
  readonly description?: ReactNode;
  readonly onConfirm: () => void | Promise<void>;
  readonly title: ReactNode;
  readonly tone?: "primary" | "danger";
}) {
  return (
    <AntPopconfirm
      cancelText={cancelLabel}
      description={description}
      icon={
        <CircleAlert
          aria-hidden
          color={`var(--aura-${tone === "danger" ? "status-danger-content" : "brand-content"})`}
          size={18}
        />
      }
      okButtonProps={{ danger: tone === "danger" }}
      okText={confirmLabel}
      title={title}
      onConfirm={onConfirm}
      {...(styles.popconfirm ? { rootClassName: styles.popconfirm } : {})}
    >
      {children}
    </AntPopconfirm>
  );
}

export interface AuraFeedback {
  readonly error: (message: ReactNode) => void;
  readonly info: (message: ReactNode) => void;
  readonly success: (message: ReactNode) => void;
  readonly warning: (message: ReactNode) => void;
}

export function useAuraFeedback(): AuraFeedback {
  const { message } = AntApp.useApp();
  return {
    error: (content) => void message.error(content),
    info: (content) => void message.info(content),
    success: (content) => void message.success(content),
    warning: (content) => void message.warning(content),
  };
}
