# Loader

`Loader` is the branded PADS progress treatment for a route or content boundary.
It communicates an indeterminate wait with visible text, status semantics, and a
quiet orbit animation derived from semantic brand and motion tokens.

Use `Spinner` inside compact controls. Use `LoadingState` when a whole empty
surface needs its established loading layout. `Loader` does not own data fetching,
timeouts, retry policy, routing, or progress percentages.

## Anatomy and content

The component contains a decorative orbit mark and a live status message. `label`
should name the current work in a few words, such as “Opening your workspace.” Add
`description` only when context helps someone understand a longer wait. Avoid vague
copy such as “Please wait” when the operation can be named.

Sizes `sm`, `md`, and `lg` change the mark while retaining the same readable copy.
Every size works in light and dark appearances and inherits the active Aura brand.
The component accepts standard `div` attributes and a `className` for layout only.

```tsx
import { Loader } from "@praabindh/aura-design-system";

<Loader
  label="Opening your workspace"
  description="Bringing the latest details into focus."
  size="lg"
/>;
```

## Accessibility and behavior

The root uses `role="status"`, `aria-live="polite"`, and `aria-busy="true"`. Its
message remains visible when animation is disabled, so progress is never conveyed
through motion or color alone. The decorative mark is hidden from assistive
technology. Reduced-motion mode stops both animations, and forced-colors mode uses
system highlight colors without glow.

Loader is informational and has no keyboard interaction. Do not move focus to it.
When loading finishes, render the resulting content and place focus only when the
product interaction itself requires it. In narrow containers and at 200% zoom, the
copy wraps below the mark without horizontal scrolling.

## States and usage

Loader represents an active indeterminate wait. Render the loaded, empty, error,
disabled, or read-only content with the component designed for that state rather
than changing Loader’s visual treatment. For destructive operations, keep the
trigger disabled while busy and announce the operation with specific copy.

Correct usage names the operation and appears close to the content it replaces.
Avoid stacking multiple loaders, using it as decoration, or leaving it visible
after an error. Existing `Spinner` and `LoadingState` APIs remain unchanged; adopt
Loader only where the richer boundary treatment is useful.
