import { ImageIcon } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./media.module.css";

export function MediaGrid({
  children,
  label,
}: {
  readonly children: ReactNode;
  readonly label?: string;
}) {
  return (
    <div aria-label={label} className={styles.mediaGrid}>
      {children}
    </div>
  );
}

export function MediaPreview({
  alt,
  fallback,
  ratio = "square",
  src,
  type = "image",
}: {
  readonly alt: string;
  readonly fallback?: ReactNode;
  readonly ratio?: "square" | "landscape" | "portrait";
  readonly src?: string;
  readonly type?: "image" | "video";
}) {
  return (
    <div className={styles.mediaPreview} data-ratio={ratio}>
      {src ? (
        type === "video" ? (
          <video aria-label={alt} controls src={src} />
        ) : (
          <img alt={alt} src={src} />
        )
      ) : (
        (fallback ?? <ImageIcon aria-hidden size={24} />)
      )}
    </div>
  );
}

export function MediaCard({
  children,
  description,
  metadata,
  onSelect,
  preview,
  title,
}: {
  readonly children?: ReactNode;
  readonly description?: ReactNode;
  readonly metadata?: ReactNode;
  readonly onSelect?: () => void;
  readonly preview: ReactNode;
  readonly title: string;
}) {
  const content = (
    <>
      {preview}
      <div className={styles.mediaBody}>
        <strong>{title}</strong>
        {description && <p>{description}</p>}
        {(metadata || children) && (
          <div className={styles.mediaMeta}>
            {metadata}
            {children}
          </div>
        )}
      </div>
    </>
  );
  return (
    <article className={styles.mediaCard} data-interactive={Boolean(onSelect)}>
      {onSelect ? (
        <button
          aria-label={`View ${title}`}
          className={styles.mediaButton}
          type="button"
          onClick={onSelect}
        >
          {content}
        </button>
      ) : (
        content
      )}
    </article>
  );
}

export function ReferenceCard({
  action,
  description,
  preview,
  title,
}: {
  readonly action?: ReactNode;
  readonly description?: ReactNode;
  readonly preview: ReactNode;
  readonly title: string;
}) {
  return (
    <article className={styles.referenceCard}>
      <div className={styles.referenceThumb}>{preview}</div>
      <div className={styles.referenceContent}>
        <strong>{title}</strong>
        {description && <small>{description}</small>}
      </div>
      {action}
    </article>
  );
}
