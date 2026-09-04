import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Drawer } from "../feedback/index.js";
import { IconButton } from "../primitives/index.js";
import { cx } from "../types.js";
import styles from "./layouts.module.css";

export function WorkspaceSurface({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <main className={cx(styles.workspaceSurface, className)} id="main">
      {children}
    </main>
  );
}

export function PageLayout({
  children,
  className,
  width = "wide",
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly width?: "full" | "wide" | "reading";
}) {
  return (
    <div className={cx(styles.pageLayout, className)} data-width={width}>
      {children}
    </div>
  );
}

export function DashboardLayout({
  main,
  aside,
}: {
  readonly main: ReactNode;
  readonly aside?: ReactNode;
}) {
  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.dashboardMain}>{main}</div>
      {aside && <aside className={styles.dashboardAside}>{aside}</aside>}
    </div>
  );
}

export function SplitPane({
  primary,
  secondary,
  label = "Split workspace",
}: {
  readonly label?: string;
  readonly primary: ReactNode;
  readonly secondary: ReactNode;
}) {
  return (
    <section aria-label={label} className={styles.splitPane}>
      <div>{primary}</div>
      <div>{secondary}</div>
    </section>
  );
}

export interface AppShellProps {
  readonly children: ReactNode;
  readonly collapsed?: boolean;
  readonly header: ReactNode;
  readonly mobileNavigationLabel?: string;
  readonly mobileNavigationOpen: boolean;
  readonly onMobileNavigationChange: (open: boolean) => void;
  readonly sidebar: ReactNode;
}

export function AppShell({
  children,
  collapsed = false,
  header,
  mobileNavigationLabel = "Navigation",
  mobileNavigationOpen,
  onMobileNavigationChange,
  sidebar,
}: AppShellProps) {
  return (
    <div className={styles.shell} data-collapsed={collapsed}>
      <aside className={styles.desktopSidebar}>{sidebar}</aside>
      <div className={styles.shellMain}>
        <header className={styles.shellHeader}>
          <span className={styles.mobileMenu}>
            <IconButton
              label={`Open ${mobileNavigationLabel.toLocaleLowerCase()}`}
              variant="ghost"
              onClick={() => onMobileNavigationChange(true)}
            >
              <Menu aria-hidden size={20} />
            </IconButton>
          </span>
          {header}
        </header>
        <WorkspaceSurface>{children}</WorkspaceSurface>
      </div>
      <Drawer
        onClose={() => onMobileNavigationChange(false)}
        open={mobileNavigationOpen}
        placement="left"
        title={mobileNavigationLabel}
      >
        {sidebar}
      </Drawer>
    </div>
  );
}

export function SidebarLayout({
  footer,
  header,
  navigation,
}: {
  readonly footer?: ReactNode;
  readonly header: ReactNode;
  readonly navigation: ReactNode;
}) {
  return (
    <div className={styles.sidebar}>
      <div>{header}</div>
      <div className={styles.sidebarNav}>{navigation}</div>
      {footer && <div className={styles.sidebarFooter}>{footer}</div>}
    </div>
  );
}

export function TopBar({
  actions,
  center,
  leading,
}: {
  readonly actions?: ReactNode;
  readonly center?: ReactNode;
  readonly leading: ReactNode;
}) {
  return (
    <div className={styles.topBar}>
      <div className={styles.topLeading}>{leading}</div>
      <div className={styles.topCenter}>{center}</div>
      <div className={styles.topActions}>{actions}</div>
    </div>
  );
}
