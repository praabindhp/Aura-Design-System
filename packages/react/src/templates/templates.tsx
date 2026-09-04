import type { ReactNode } from "react";
import type { AuraBrand } from "@praabindh/aura-tokens";
import { DashboardLayout, PageLayout, SplitPane } from "../layouts/index.js";
import {
  PageHeader,
  SettingsLayout,
  type PageHeaderProps,
  type SettingsNavigationItem,
} from "../patterns/index.js";
import { ProductMark } from "../primitives/index.js";
import styles from "./templates.module.css";

export function AuthTemplate({
  brand,
  brandDescription,
  brandTitle,
  children,
  description,
  footer,
  title,
}: {
  readonly brand: AuraBrand;
  readonly brandDescription: ReactNode;
  readonly brandTitle: ReactNode;
  readonly children: ReactNode;
  readonly description?: ReactNode;
  readonly footer?: ReactNode;
  readonly title: ReactNode;
}) {
  return (
    <main className={styles.auth}>
      <section className={styles.authBrand}>
        <ProductMark brand={brand} />
        <div className={styles.authBrandContent}>
          <h1>{brandTitle}</h1>
          <p>{brandDescription}</p>
        </div>
        {footer}
      </section>
      <section className={styles.authFormArea}>
        <div className={styles.authForm}>
          <header className={styles.authFormHeader}>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </header>
          {children}
        </div>
      </section>
    </main>
  );
}

export function DashboardTemplate({
  aside,
  children,
  header,
}: {
  readonly aside?: ReactNode;
  readonly children: ReactNode;
  readonly header: PageHeaderProps;
}) {
  return (
    <PageLayout>
      <PageHeader {...header} />
      <DashboardLayout aside={aside} main={children} />
    </PageLayout>
  );
}

export function SettingsTemplate<Value extends string>({
  children,
  header,
  items,
  onValueChange,
  value,
}: {
  readonly children: ReactNode;
  readonly header: PageHeaderProps;
  readonly items: ReadonlyArray<SettingsNavigationItem<Value>>;
  readonly onValueChange: (value: Value) => void;
  readonly value: Value;
}) {
  return (
    <PageLayout>
      <PageHeader {...header} />
      <SettingsLayout items={items} value={value} onValueChange={onValueChange}>
        {children}
      </SettingsLayout>
    </PageLayout>
  );
}

export function ConversationTemplate({
  body,
  composer,
}: {
  readonly body: ReactNode;
  readonly composer: ReactNode;
}) {
  return (
    <div className={styles.conversation}>
      <div className={styles.conversationBody}>{body}</div>
      <div className={styles.conversationComposer}>{composer}</div>
    </div>
  );
}

export function EditorTemplate({
  footer,
  primary,
  secondary,
  toolbar,
}: {
  readonly footer?: ReactNode;
  readonly primary: ReactNode;
  readonly secondary: ReactNode;
  readonly toolbar?: ReactNode;
}) {
  return (
    <section className={styles.editor}>
      {toolbar && <header className={styles.editorToolbar}>{toolbar}</header>}
      <div className={styles.editorBody}>
        <SplitPane label="Editor workspace" primary={primary} secondary={secondary} />
      </div>
      {footer && <footer className={styles.editorFooter}>{footer}</footer>}
    </section>
  );
}

export function MediaStudioTemplate({
  controls,
  preview,
  references,
}: {
  readonly controls: ReactNode;
  readonly preview: ReactNode;
  readonly references?: ReactNode;
}) {
  return (
    <PageLayout>
      <SplitPane label="Media studio" primary={controls} secondary={preview} />
      {references}
    </PageLayout>
  );
}
