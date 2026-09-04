import { createElement, type ReactNode } from "react";
import { common, createLowlight } from "lowlight";

import styles from "../rich-markdown.module.css";

const highlighter = createLowlight(common);
const maximumHighlightedLength = 50_000;

interface TextNode {
  readonly type: "text";
  readonly value: string;
}

interface ElementNode {
  readonly type: "element";
  readonly properties?: Readonly<Record<string, unknown>>;
  readonly children: readonly HighlightNode[];
}

type HighlightNode = TextNode | ElementNode;

const tokenClassMap: Readonly<Record<string, string | undefined>> = {
  "hljs-keyword": styles.tokenKeyword,
  "hljs-selector-tag": styles.tokenKeyword,
  "hljs-built_in": styles.tokenKeyword,
  "hljs-type": styles.tokenKeyword,
  "hljs-literal": styles.tokenKeyword,
  "hljs-number": styles.tokenNumber,
  "hljs-symbol": styles.tokenNumber,
  "hljs-bullet": styles.tokenNumber,
  "hljs-string": styles.tokenString,
  "hljs-title": styles.tokenString,
  "hljs-section": styles.tokenString,
  "hljs-attribute": styles.tokenString,
  "hljs-template-variable": styles.tokenString,
  "hljs-variable": styles.tokenString,
  "hljs-regexp": styles.tokenString,
  "hljs-comment": styles.tokenComment,
  "hljs-quote": styles.tokenComment,
  "hljs-meta": styles.tokenMeta,
  "hljs-meta-keyword": styles.tokenMeta,
  "hljs-meta-string": styles.tokenMeta,
  "hljs-addition": styles.tokenAddition,
  "hljs-deletion": styles.tokenDeletion,
};

function classNames(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return typeof value === "string" ? value.split(/\s+/) : [];
}

function renderHighlightNode(node: HighlightNode, key: string): ReactNode {
  if (node.type === "text") return node.value;

  const mappedClasses = classNames(node.properties?.className)
    .map((name) => tokenClassMap[name])
    .filter((name): name is string => Boolean(name));
  const className = [styles.syntaxToken, ...mappedClasses].filter(Boolean).join(" ");

  return createElement(
    "span",
    { key, className: className || undefined },
    node.children.map((child, index) => renderHighlightNode(child, `${key}-${index}`)),
  );
}

export function highlightCode(code: string, language: string | null): ReactNode {
  if (code.length > maximumHighlightedLength) return code;

  const tree =
    language && highlighter.registered(language)
      ? highlighter.highlight(language, code)
      : highlighter.highlightAuto(code);

  return (tree.children as readonly HighlightNode[]).map((node, index) =>
    renderHighlightNode(node, `token-${index}`),
  );
}
