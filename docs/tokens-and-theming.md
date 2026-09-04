# Tokens and theming

## Goals

PADS tokens let every Aura product share a polished visual language without
copying values. Products request semantic intent; theme and brand recipes choose
the appropriate visible value.

Token changes are API changes. Renaming or removing a token, or materially
changing its documented meaning, follows SemVer and requires migration notes.

## Token layers

### Reference tokens

Reference tokens contain raw design values and are the only ordinary location
for literal colors, dimensions, type metrics, radii, shadows, durations, and
layer values.

Examples:

```text
reference.color.neutral.0
reference.color.orange.700
reference.space.4
reference.radius.control
reference.motion.duration.fast
```

Reference names describe the value, not where it is used. Product code and
components do not consume them directly.

### Semantic tokens

Semantic tokens describe intent across themes:

```text
semantic.color.canvas
semantic.color.surface.default
semantic.color.text.primary
semantic.color.border.subtle
semantic.color.action.primary
semantic.color.status.danger
semantic.focus.ring
```

Light and dark modes resolve every required semantic role. A component should
usually stop at this layer.

### Brand tokens

Brand recipes resolve the focused set of roles that distinguish Aura products:
action, on-action content, subtle and muted backgrounds, borders, focus rings,
marks, highlights, and restrained data accents. Brand colors are not a license
to tint every surface.

The brand families come from the implemented Aura products. PADS assigns
separate semantic action shades where the original accent was too close to the
minimum or failed on a soft surface, then checks the final pairs against WCAG
contrast math:

| Brand       | Light action / foreground | Contrast | Dark action / foreground | Contrast |
| ----------- | ------------------------- | -------: | ------------------------ | -------: |
| VerbAura    | `#B54700` / `#FFFFFF`     |   5.43:1 | `#FF8200` / `#160900`    |   7.87:1 |
| CognAura    | `#086D9C` / `#FFFFFF`     |   5.71:1 | `#05A0D3` / `#00161F`    |   6.15:1 |
| RendAura    | `#A12678` / `#FFFFFF`     |   6.85:1 | `#F05CB7` / `#240018`    |   6.36:1 |
| CharterAura | `#077A55` / `#FFFFFF`     |   5.35:1 | `#34D399` / `#001B11`    |   9.38:1 |

These values are suitable for normal-size action labels. Automated checks must
guard the pair, hover, pressed, focus, disabled, and adjacent-border states.
Decorative shades do not inherit text suitability merely because the action
pair passes.

### Component tokens

Component tokens capture a stable decision that cannot be expressed clearly by
an existing semantic role:

```text
component.button.height.default
component.dialog.width.max
component.shell.header.height
component.chart.plot.height.min
```

Do not create component tokens as aliases for every CSS declaration. Repeated
one-off geometry is a sign to revisit composition or the shared scale.

## Source and generated output

Committed source follows the Design Tokens Community Group shape using `$type`,
`$value`, references, and descriptions. A repository-owned deterministic Node
compiler resolves and validates that source into platform artifacts; it is the
single token build path and does not depend on Style Dictionary.

The build must fail on:

- unresolved aliases or cycles;
- unexpected duplicate CSS names;
- literal colors outside approved source files;
- missing light, dark, or brand roles;
- invalid units or token types;
- contrast regression in a required pairing;
- generated output that differs between identical clean builds.

Generated output must include a banner identifying its source and build command.
Never review a generated change without its source change.

## Color modes

PADS supports `light`, `dark`, and `system` consumer choices. `system` resolves
from `prefers-color-scheme` and updates when that preference changes unless the
consumer supplies a fixed mode.

Dark mode uses a quiet, near-black hierarchy appropriate to the current Aura
workspaces: a black canvas, subtly raised neutral surfaces, visible borders, and
high-contrast text. It is not produced by mathematically inverting light mode.

Each mode defines:

- canvas, default, subtle, raised, overlay, and hover surfaces;
- primary, secondary, muted, disabled, and inverse text;
- default, subtle, strong, interactive, and focus borders;
- primary, neutral, destructive, success, warning, and informational actions;
- scrims, shadows, code colors, selection, and chart tones.

## Applying a theme

The provider renders explicit attributes rather than hundreds of inline custom
properties:

```html
<div data-aura-theme="dark" data-aura-brand="cognaura">
  <!-- PADS surface -->
</div>
```

Generated CSS resolves semantic aliases for that scope. This permits side-by-side
theme examples and prevents one embedded PADS surface from unexpectedly
retinting an entire host page.

Consumer applications own persistence. The optional initialization helper may
read a caller-specified storage key and apply the mode before hydration. It must
be safe under a strict content security policy and documented separately from
the React runtime.

## Typography

Lexend Variable is the Aura interface typeface and should be self-hosted by the
package or consumer. The semantic scale preserves the implemented product
hierarchy:

| Role        | Default size | Use                                            |
| ----------- | -----------: | ---------------------------------------------- |
| Caption     |         12px | Supporting metadata and compact tooltips       |
| Label       |         12px | Fields, compact navigation, tags, dense tables |
| Button      |         13px | Standard actions                               |
| Body        |         14px | Interface copy and controls                    |
| Body large  |         16px | Introductory copy and emphasized values        |
| Title small |         18px | Card and section titles                        |
| Title       |         24px | Page titles                                    |
| Display     |         32px | Dashboard greetings and rare hero headings     |

Consumers use semantic roles rather than matching these values manually.
Line-height and letter-spacing are part of each type token.

## Spacing, shape, and motion

- Use a 4px base scale with named semantic gaps where a repeated relationship
  needs stronger meaning.
- Controls, cards, overlays, and pills use tokenized radii; arbitrary shape
  variants are not public API.
- Shadows differ by theme and should clarify elevation, not decorate every card.
- Motion communicates state change. Durations and easing are tokens, ambient
  animation is rare, and reduced-motion mode removes nonessential movement.
- Z-index tokens represent documented layers rather than escalating numbers.

## Adding a brand

1. Define the product-neutral brand recipe and accessible on-colors.
2. Supply light and dark values for every required role.
3. Run contrast and invariant tests.
4. Add Storybook matrices for controls, feedback, charts, overlays, and marks.
5. Review the brand at narrow and wide widths in both modes.
6. Add documentation and a Changeset.

A product may map its own product identifier to a PADS brand, but the tokens
package must not import the product's contract type.
