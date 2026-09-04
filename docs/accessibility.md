# Accessibility standard

PADS treats WCAG 2.2 AA as a release requirement, not a product-side add-on.
Automated checks catch only part of the standard; manual interaction and
assistive-technology review remain required.

## Default contract

Public components must:

- use native HTML semantics whenever they express the behavior;
- provide an accessible name, role, state, and value;
- work with keyboard alone and keep focus order logical;
- show a visible focus indicator in every theme and brand;
- restore or deliberately move focus after overlays and destructive actions;
- expose errors and status in text, not color alone;
- meet contrast for text, controls, icons, focus, and meaningful graphics;
- remain usable at 200% zoom and at a 320 CSS-pixel viewport;
- honor reduced motion, forced colors, color scheme, and user font settings;
- avoid unexpected context changes and time limits.

## Keyboard models

Use established ARIA Authoring Practices only when native elements cannot
provide the interaction.

- Buttons activate with Enter and Space.
- Links navigate and are not styled buttons for non-navigation actions.
- Menus, listboxes, tabs, comboboxes, and trees implement their documented arrow,
  Home, End, Enter, Space, and Escape behavior.
- Modal dialogs trap focus, close predictably, have a labelled title, and return
  focus to the invoker when it still exists.
- Non-modal popovers do not trap focus unnecessarily.
- Roving focus or `aria-activedescendant` behavior is centralized in the owning
  primitive rather than reimplemented by consumers.
- Disabled and read-only states remain distinguishable and correctly announced.

Every keyboard-interactive story includes a `play` test covering its primary
path and Escape/cancellation behavior where relevant.

## Focus

Do not remove an outline without supplying an equal or stronger visible focus
indicator. Focus appearance must:

- survive light, dark, brand, high-contrast, and image-backed surfaces;
- have sufficient contrast between focused and unfocused states;
- remain visible when a control is partly clipped or inside a scroll container;
- use `:focus-visible` when pointer focus should not show the same ring;
- avoid relying on box shadow alone under forced colors.

Components must not steal focus during ordinary rerenders. Loading completion
does not automatically move focus unless the documented workflow requires it.

## Color and non-text contrast

- Normal text targets at least 4.5:1; large text targets at least 3:1.
- Meaningful control boundaries, focus indicators, and graphics target at least
  3:1 against adjacent colors.
- Disabled controls are exempt from some WCAG contrast requirements but must
  still be recognizable in the product context.
- Success, warning, danger, selected, and chart-series states pair color with
  text, iconography, position, shape, or pattern.
- Brand decorative colors are not assumed safe for text. Only tested semantic
  foreground/background pairs may be used.

## Touch and pointer input

Interactive targets meet WCAG 2.2 target-size requirements and should normally
provide at least a 36px control box, with 44px favored for primary mobile
actions. Dense exceptions need adequate spacing and a documented reason.

No required action depends only on hover, precise dragging, or multipoint
gestures. Drag interactions have keyboard or simple-pointer alternatives.

## Motion and animation

When `prefers-reduced-motion: reduce` is active:

- remove ambient, parallax, spring, and large spatial transitions;
- keep only near-instant state feedback needed for comprehension;
- avoid smooth scrolling initiated by the component;
- retain status changes in a nonanimated form.

Animation must not flash at unsafe frequencies. Automatically moving content
offers pause or stop behavior when required.

## Responsive layout and zoom

At 320px and 200% zoom:

- controls and content do not overlap or become unreachable;
- horizontal scrolling is limited to inherently two-dimensional content such as
  data tables, with an accessible scroll region;
- text reflows without clipping;
- fixed or sticky regions do not hide focused content;
- overlays fit the visual viewport and account for mobile keyboards;
- target order matches reading and DOM order.

Prefer container queries so a component responds to its actual allocation in a
sidebar, panel, or page rather than assuming the viewport width.

## Content and announcements

- Labels remain visible for persistent form fields; placeholders are examples,
  not labels.
- Help and error text are programmatically associated with the control.
- Error summaries link or move focus to invalid fields when appropriate.
- `aria-live` regions are used sparingly and do not repeatedly announce loading
  loops.
- Decorative icons and images are hidden from assistive technology; informative
  media receives useful alternative text.
- Icon-only actions require a stable accessible name and visible tooltip where
  it helps sighted users.

See [content design](content-design.md) for language requirements.

## Charts and data

Every chart provides:

- a concise accessible name and summary;
- textual values or a table alternative for exact data;
- legends that do not depend on color alone;
- useful empty and error states;
- keyboard-accessible interactive details, or a noninteractive equivalent;
- reduced-motion behavior.

## Verification matrix

Automated evidence:

- semantic component tests in a real browser;
- axe checks on every stable Storybook story with violations treated as errors;
- token contrast tests;
- visual snapshots for focus, forced colors, and reduced motion where useful.

Manual evidence for changed interactive components:

1. keyboard-only completion and cancellation;
2. VoiceOver on Safari and one additional screen-reader/browser pairing for
   complex widgets;
3. light and dark review at 200% zoom;
4. narrow touch viewport review;
5. reduced motion and forced-colors review.

The component author records relevant results in the pull request. An automated
axe pass is never presented as complete WCAG conformance.
