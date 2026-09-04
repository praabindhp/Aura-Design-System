import { useEffect, useMemo, useRef, useState } from "react";

import { highlightCode } from "./internal/highlight.js";
import type { CodeCopyEvent, CodeCopyHandler } from "./types.js";
import styles from "./rich-markdown.module.css";

interface CodeBlockProps {
  readonly code: string;
  readonly language: string | null;
  readonly copyCode: CodeCopyHandler | undefined;
  readonly onCodeCopy: ((event: CodeCopyEvent) => void) | undefined;
}

type CopyState = "idle" | "copying" | "success" | "error";

async function writeToClipboard(code: string): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    throw new Error("Clipboard access is unavailable");
  }
  await navigator.clipboard.writeText(code);
}

export function CodeBlock({ code, language, copyCode, onCodeCopy }: CodeBlockProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  const highlightedCode = useMemo(
    () => highlightCode(code, language),
    [code, language],
  );

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const scheduleReset = () => {
    if (!mounted.current) return;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), 2_000);
  };

  const handleCopy = async () => {
    setCopyState("copying");
    let event: CodeCopyEvent;

    try {
      await (copyCode ?? writeToClipboard)(code);
      if (mounted.current) setCopyState("success");
      event = { code, language, status: "success", error: null };
    } catch (error: unknown) {
      if (mounted.current) setCopyState("error");
      event = {
        code,
        language,
        status: "error",
        error:
          error instanceof Error
            ? error
            : new Error("Clipboard operation failed", { cause: error }),
      };
    }

    scheduleReset();
    onCodeCopy?.(event);
  };

  const buttonLabel =
    copyState === "copying"
      ? "Copying…"
      : copyState === "success"
        ? "Copied"
        : copyState === "error"
          ? "Copy failed"
          : "Copy";

  return (
    <section className={styles.codeBlock}>
      <header className={styles.codeHeader}>
        <span className={styles.codeLanguage}>{language ?? "text"}</span>
        <button
          className={styles.copyButton}
          type="button"
          disabled={copyState === "copying"}
          onClick={handleCopy}
        >
          {buttonLabel}
        </button>
        <span className={styles.visuallyHidden} aria-live="polite">
          {copyState === "success"
            ? "Code copied to clipboard"
            : copyState === "error"
              ? "Code could not be copied"
              : ""}
        </span>
      </header>
      <pre className={styles.codePre} tabIndex={0}>
        <code className={styles.code}>{highlightedCode}</code>
      </pre>
    </section>
  );
}
