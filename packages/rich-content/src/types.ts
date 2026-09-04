import type { HTMLAttributes } from "react";

export type ExternalLinkBehavior = "new-tab" | "same-tab";
export type CodeCopyStatus = "success" | "error";

export interface CodeCopyEvent {
  readonly code: string;
  readonly language: string | null;
  readonly status: CodeCopyStatus;
  readonly error: Error | null;
}

export type CodeCopyHandler = (code: string) => void | Promise<void>;

export interface RichMarkdownProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  readonly children: string;
  /** Images are omitted by default to avoid unapproved tracking requests. */
  readonly allowImages?: boolean;
  readonly externalLinks?: ExternalLinkBehavior;
  readonly copyCode?: CodeCopyHandler;
  readonly onCodeCopy?: (event: CodeCopyEvent) => void;
}
