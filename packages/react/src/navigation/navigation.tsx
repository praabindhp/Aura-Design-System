import { ChevronRight } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { AntPagination } from "../internal/antd.js";
import type { RenderLink } from "../types.js";
import styles from "./navigation.module.css";

export function SkipLink({ children = "Skip to main content", href = "#main" }) {
  return (
    <a className={styles.skipLink} href={href}>
      {children}
    </a>
  );
}

export interface BreadcrumbItem {
  readonly href?: string;
  readonly label: ReactNode;
}

const defaultRenderLink: RenderLink = ({ children, className, href }) => (
  <a className={className} href={href}>
    {children}
  </a>
);

export function Breadcrumbs({
  items,
  label = "Breadcrumb",
  renderLink = defaultRenderLink,
}: {
  readonly items: ReadonlyArray<BreadcrumbItem>;
  readonly label?: string;
  readonly renderLink?: RenderLink;
}) {
  return (
    <nav aria-label={label} className={styles.breadcrumbs}>
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${index}-${String(item.href)}`}>
              {index > 0 && <ChevronRight aria-hidden size={13} />}
              {item.href && !current ? (
                renderLink({ children: item.label, className: "", href: item.href })
              ) : (
                <span
                  aria-current={current ? "page" : undefined}
                  className={current ? styles.current : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export interface TabItem<Value extends string = string> {
  readonly content: ReactNode;
  readonly disabled?: boolean;
  readonly label: ReactNode;
  readonly value: Value;
}

export function Tabs<Value extends string>({
  ariaLabel,
  items,
  onValueChange,
  value,
}: {
  readonly ariaLabel: string;
  readonly items: ReadonlyArray<TabItem<Value>>;
  readonly onValueChange: (value: Value) => void;
  readonly value: Value;
}) {
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );
  const move = (from: number, direction: 1 | -1) => {
    let next = from;
    for (let count = 0; count < items.length; count += 1) {
      next = (next + direction + items.length) % items.length;
      const item = items[next];
      if (item && !item.disabled) {
        onValueChange(item.value);
        refs.current[next]?.focus();
        return;
      }
    }
  };
  const activeItem = items[activeIndex];
  return (
    <div className={styles.tabs}>
      <div aria-label={ariaLabel} className={styles.tabList} role="tablist">
        {items.map((item, index) => (
          <button
            ref={(node) => {
              refs.current[index] = node;
            }}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={item.value === value}
            className={styles.tab}
            disabled={item.disabled}
            id={`${id}-tab-${index}`}
            key={item.value}
            role="tab"
            tabIndex={item.value === value ? 0 : -1}
            type="button"
            onClick={() => onValueChange(item.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                move(index, -1);
              } else if (event.key === "Home") {
                event.preventDefault();
                move(-1, 1);
              } else if (event.key === "End") {
                event.preventDefault();
                move(0, -1);
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <div
          aria-labelledby={`${id}-tab-${activeIndex}`}
          className={styles.tabPanel}
          id={`${id}-panel-${activeIndex}`}
          role="tabpanel"
          tabIndex={0}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}

export function Pagination({
  current,
  label = "Pagination",
  nextLabel = "Next page",
  onChange,
  pageLabel = (page) => `Page ${page}`,
  pageSize,
  previousLabel = "Previous page",
  total,
}: {
  readonly current: number;
  readonly label?: string;
  readonly nextLabel?: string;
  readonly onChange: (page: number) => void;
  readonly pageLabel?: (page: number) => string;
  readonly pageSize: number;
  readonly previousLabel?: string;
  readonly total: number;
}) {
  return (
    <nav aria-label={label} className={styles.pagination}>
      <AntPagination
        responsive
        current={current}
        pageSize={pageSize}
        showSizeChanger={false}
        total={total}
        itemRender={(page, type, element) => {
          if (!isValidElement<HTMLAttributes<HTMLElement>>(element)) return element;
          const itemLabel =
            type === "next"
              ? nextLabel
              : type === "prev"
                ? previousLabel
                : type === "jump-next"
                  ? `Jump forward to ${pageLabel(page)}`
                  : type === "jump-prev"
                    ? `Jump back to ${pageLabel(page)}`
                    : pageLabel(page);
          return cloneElement(element, {
            "aria-label": itemLabel,
            ...(type === "page" && page === current ? { "aria-current": "page" } : {}),
          });
        }}
        onChange={(page) => onChange(page)}
      />
    </nav>
  );
}
