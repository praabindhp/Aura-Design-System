import { ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEventHandler,
  type ReactNode,
} from "react";
import { Dialog } from "../feedback/index.js";
import { SearchInput } from "../forms/index.js";
import { ProductMark } from "../primitives/index.js";
import { type AuraBrand } from "@praabindh/aura-tokens";
import type { AuraIcon } from "../types.js";
import styles from "./conversation.module.css";

export interface ComposerDockProps {
  readonly action: ReactNode;
  readonly brand: AuraBrand;
  readonly collapsedLabel: string;
  readonly controls?: ReactNode;
  readonly defaultExpanded?: boolean;
  readonly editor: ReactNode;
  readonly expanded?: boolean;
  readonly label: string;
  readonly name: string;
  readonly onExpandedChange?: (expanded: boolean) => void;
  readonly onSubmit: FormEventHandler<HTMLFormElement>;
}

export function ComposerDock({
  action,
  brand,
  collapsedLabel,
  controls,
  defaultExpanded = false,
  editor,
  expanded,
  label,
  name,
  onExpandedChange,
  onSubmit,
}: ComposerDockProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const controlled = expanded !== undefined;
  const isExpanded = expanded ?? internalExpanded;
  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasExpanded = useRef(isExpanded);
  const setExpanded = useCallback(
    (next: boolean) => {
      if (!controlled) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [controlled, onExpandedChange],
  );

  useEffect(() => {
    if (isExpanded) {
      formRef.current
        ?.querySelector<HTMLElement>("textarea, input, [contenteditable='true']")
        ?.focus();
    } else if (wasExpanded.current) {
      triggerRef.current?.focus();
    }
    wasExpanded.current = isExpanded;
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded || controlled) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [controlled, isExpanded, setExpanded]);

  return (
    <div
      ref={rootRef}
      aria-label={`${label} dock`}
      className={styles.composerDock}
      data-expanded={isExpanded}
      role="group"
      onKeyDown={(event) => {
        if (event.key === "Escape") setExpanded(false);
      }}
    >
      <button
        ref={triggerRef}
        aria-expanded={isExpanded}
        aria-label={collapsedLabel}
        className={styles.composerTrigger}
        type="button"
        onClick={() => setExpanded(true)}
      >
        <ProductMark brand={brand} decorative size="sm" />
        <span>{name}</span>
      </button>
      <form
        ref={formRef}
        aria-label={label}
        className={styles.composerSurface}
        onSubmit={(event) => {
          onSubmit(event);
          setExpanded(false);
        }}
      >
        <div className={styles.composerEditor}>{editor}</div>
        <div className={styles.composerFooter}>
          <div className={styles.composerControls}>{controls}</div>
          <div className={styles.composerAction}>{action}</div>
        </div>
      </form>
    </div>
  );
}

export interface PaletteItem {
  readonly category?: string;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly icon: AuraIcon;
  readonly id: string;
  readonly label: string;
}

export function ContextPalette({
  emptyMessage = "No matching items",
  items,
  label,
  onClose,
  onSelect,
}: {
  readonly emptyMessage?: string;
  readonly items: ReadonlyArray<PaletteItem>;
  readonly label: string;
  readonly onClose?: () => void;
  readonly onSelect: (item: PaletteItem) => void;
}) {
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const [highlighted, setHighlighted] = useState(() =>
    items.findIndex((item) => !item.disabled),
  );
  useEffect(() => {
    setHighlighted(items.findIndex((item) => !item.disabled));
  }, [items]);
  const move = (direction: 1 | -1) => {
    let next = highlighted;
    for (let count = 0; count < items.length; count += 1) {
      next =
        next < 0
          ? direction === 1
            ? 0
            : items.length - 1
          : (next + direction + items.length) % items.length;
      if (!items[next]?.disabled) {
        setHighlighted(next);
        refs.current[next]?.focus();
        return;
      }
    }
  };

  if (items.length === 0)
    return <div className={styles.contextEmpty}>{emptyMessage}</div>;
  return (
    <div
      aria-label={label}
      className={styles.contextPalette}
      role="listbox"
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          move(1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          move(-1);
        } else if (event.key === "Escape") {
          event.preventDefault();
          onClose?.();
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          const direction = event.key === "Home" ? 1 : -1;
          let enabled = items.findIndex((item) => !item.disabled);
          if (direction === -1) {
            enabled = -1;
            for (let index = items.length - 1; index >= 0; index -= 1) {
              if (!items[index]?.disabled) {
                enabled = index;
                break;
              }
            }
          }
          if (enabled >= 0) {
            setHighlighted(enabled);
            refs.current[enabled]?.focus();
          }
        }
      }}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            ref={(node) => {
              refs.current[index] = node;
            }}
            aria-selected={!item.disabled && highlighted === index}
            className={styles.contextOption}
            data-highlighted={highlighted === index}
            disabled={item.disabled}
            id={`${id}-option-${index}`}
            key={item.id}
            role="option"
            tabIndex={highlighted === index ? 0 : -1}
            type="button"
            onClick={() => onSelect(item)}
            onFocus={() => setHighlighted(index)}
          >
            <span aria-hidden className={styles.contextIcon}>
              <Icon size={18} />
            </span>
            <span className={styles.contextContent}>
              <strong>{item.label}</strong>
              {item.description && <small>{item.description}</small>}
            </span>
            {item.category && (
              <span className={styles.contextCategory}>{item.category}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function CommandPalette({
  emptyMessage,
  items,
  onClose,
  onSelect,
  open,
  placeholder = "Search commands",
  title = "Command palette",
}: {
  readonly emptyMessage?: string;
  readonly items: ReadonlyArray<PaletteItem>;
  readonly onClose: () => void;
  readonly onSelect: (item: PaletteItem) => void;
  readonly open: boolean;
  readonly placeholder?: string;
  readonly title?: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      `${item.label} ${item.description ?? ""} ${item.category ?? ""}`
        .toLocaleLowerCase()
        .includes(normalized),
    );
  }, [items, query]);
  return (
    <Dialog onClose={onClose} open={open} title={title} width="sm">
      <div className={styles.commandBody}>
        <SearchInput
          autoFocus
          aria-label={placeholder}
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ContextPalette
          items={filtered}
          label={title}
          onClose={onClose}
          onSelect={(item) => {
            onSelect(item);
            onClose();
          }}
          {...(emptyMessage ? { emptyMessage } : {})}
        />
      </div>
    </Dialog>
  );
}

export function ContextAction({ label }: { readonly label: string }) {
  return (
    <span aria-hidden title={label}>
      <ArrowUpRight size={16} />
    </span>
  );
}
