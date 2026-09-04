import {
  Children,
  isValidElement,
  type AnchorHTMLAttributes,
  type ImgHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "./CodeBlock.js";
import { isExternalHttpUrl, safeUrl } from "./internal/safe-url.js";
import type {
  CodeCopyEvent,
  CodeCopyHandler,
  ExternalLinkBehavior,
  RichMarkdownProps,
} from "./types.js";
import styles from "./rich-markdown.module.css";

interface MarkdownCodeProps {
  readonly children?: ReactNode;
  readonly className?: string;
}

interface MarkdownPreProps {
  readonly children?: ReactNode;
  readonly copyCode: CodeCopyHandler | undefined;
  readonly onCodeCopy: ((event: CodeCopyEvent) => void) | undefined;
}

function languageFromClassName(className: string | undefined): string | null {
  return /(?:^|\s)language-([\w-]+)/.exec(className ?? "")?.[1] ?? null;
}

function markdownCodeText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(markdownCodeText).join("");
  return "";
}

function omitNode<T extends { node?: unknown }>(props: T): Omit<T, "node"> {
  const htmlProps = { ...props };
  delete htmlProps.node;
  return htmlProps;
}

function MarkdownPre({ children, copyCode, onCodeCopy }: MarkdownPreProps) {
  const onlyChild = Children.count(children) === 1 ? Children.only(children) : null;

  if (isValidElement<MarkdownCodeProps>(onlyChild)) {
    const code = markdownCodeText(onlyChild.props.children).replace(/\n$/, "");
    const language = languageFromClassName(onlyChild.props.className);
    return (
      <CodeBlock
        code={code}
        language={language}
        copyCode={copyCode}
        onCodeCopy={onCodeCopy}
      />
    );
  }

  return <pre className={styles.codePre}>{children}</pre>;
}

interface MarkdownLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly externalLinks: ExternalLinkBehavior;
}

function MarkdownLink(props: MarkdownLinkProps & { readonly node?: unknown }) {
  const { href, children, externalLinks, ...propsWithNode } = props;
  const anchorProps = omitNode(propsWithNode);
  const hrefValue = safeUrl(href);
  if (!hrefValue) {
    return <span className={styles.blockedLink}>{children}</span>;
  }

  const opensNewTab = externalLinks === "new-tab" && isExternalHttpUrl(hrefValue);

  return (
    <a
      {...anchorProps}
      className={styles.link}
      href={hrefValue}
      rel={opensNewTab ? "noopener noreferrer" : anchorProps.rel}
      target={opensNewTab ? "_blank" : anchorProps.target}
    >
      {children}
      {opensNewTab ? (
        <>
          <span className={styles.externalMark} aria-hidden="true">
            ↗
          </span>
          <span className={styles.visuallyHidden}> (opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}

interface MarkdownImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  readonly allowImages: boolean;
}

function MarkdownImage(props: MarkdownImageProps & { readonly node?: unknown }) {
  const { allowImages, src, alt = "", ...propsWithNode } = props;
  const imageProps = omitNode(propsWithNode);
  const srcValue = typeof src === "string" ? safeUrl(src) : null;
  if (!allowImages || !srcValue) {
    return (
      <span className={styles.imageOmitted}>
        {alt ? `Image omitted: ${alt}` : "Image omitted"}
      </span>
    );
  }

  return (
    <img
      {...imageProps}
      className={styles.image}
      src={srcValue}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}

function withClassName<T extends { readonly className?: string | undefined }>(
  className: string | undefined,
  props: T,
): T {
  return { ...props, className };
}

function createComponents(
  allowImages: boolean,
  externalLinks: ExternalLinkBehavior,
  copyCode: CodeCopyHandler | undefined,
  onCodeCopy: ((event: CodeCopyEvent) => void) | undefined,
): Components {
  return {
    h1: (props) => <h1 {...withClassName(styles.headingOne, omitNode(props))} />,
    h2: (props) => <h2 {...withClassName(styles.headingTwo, omitNode(props))} />,
    h3: (props) => <h3 {...withClassName(styles.headingThree, omitNode(props))} />,
    h4: (props) => <h4 {...withClassName(styles.headingFour, omitNode(props))} />,
    p: (props) => <p {...withClassName(styles.paragraph, omitNode(props))} />,
    a: (props) => <MarkdownLink {...props} externalLinks={externalLinks} />,
    img: (props) => <MarkdownImage {...props} allowImages={allowImages} />,
    code: (props) => <code {...withClassName(styles.inlineCode, omitNode(props))} />,
    pre: (props) => (
      <MarkdownPre copyCode={copyCode} onCodeCopy={onCodeCopy}>
        {props.children}
      </MarkdownPre>
    ),
    table: (props) => (
      <div
        className={styles.tableScroller}
        role="region"
        aria-label="Markdown table"
        tabIndex={0}
      >
        <table {...withClassName(styles.table, omitNode(props))} />
      </div>
    ),
    thead: (props) => <thead {...withClassName(styles.tableHead, omitNode(props))} />,
    th: (props) => <th {...withClassName(styles.tableHeader, omitNode(props))} />,
    td: (props) => <td {...withClassName(styles.tableCell, omitNode(props))} />,
    blockquote: (props) => (
      <blockquote {...withClassName(styles.blockquote, omitNode(props))} />
    ),
    hr: (props) => <hr {...withClassName(styles.rule, omitNode(props))} />,
  };
}

function joinClassNames(
  ...names: ReadonlyArray<string | undefined>
): string | undefined {
  const value = names.filter(Boolean).join(" ");
  return value || undefined;
}

export function RichMarkdown({
  children,
  allowImages = false,
  externalLinks = "new-tab",
  copyCode,
  onCodeCopy,
  className,
  ...htmlProps
}: RichMarkdownProps): ReactElement {
  const components = createComponents(allowImages, externalLinks, copyCode, onCodeCopy);

  return (
    <div
      {...htmlProps}
      className={joinClassNames(styles.content, className)}
      data-aura-rich-content=""
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        skipHtml
        urlTransform={(url) => safeUrl(url)}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
