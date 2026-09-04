# @praabindh/aura-rich-content

Safe, accessible Markdown presentation for Praabindh's Aura Design System
(PADS), under PRAABINDH CORP.

## Security and accessibility defaults

- Raw HTML is never executed.
- Only relative URLs, fragments, and `http`, `https`, `mailto`, or `tel`
  protocols are accepted.
- Remote images require `allowImages`; accepted images are lazy-loaded without
  a referrer.
- External web links open with `noopener noreferrer` by default and announce
  that behavior to assistive technology.
- Code copy feedback is based on the awaited clipboard result, reports failure,
  and clears timers on unmount.
- Tables and long code blocks use keyboard-focusable scroll regions.
- Highlight syntax is translated into package-owned CSS Module classes. No
  global Highlight.js stylesheet or product selector is required.

## Usage

```tsx
import { RichMarkdown } from "@praabindh/aura-rich-content";

<RichMarkdown
  onCodeCopy={({ status }) => {
    if (status === "error") reportClipboardFailure();
  }}
>
  {trustedOrUntrustedMarkdown}
</RichMarkdown>;
```

Load the Aura token theme once at the application root. The package intentionally
does not depend on Ant Design, Lucide, or the core React package, keeping its
public boundary product-neutral and cycle-free.
