# Component standards

## Shared-component test

A component belongs in PADS when its visual and interaction contract is useful
across products and can be expressed without product business logic. Before
adding one, answer:

1. Which recurring user problem does it solve?
2. Which existing primitive or pattern is insufficient?
3. Can at least two product contexts use the same semantics and behavior?
4. Can data, routing, and persistence remain outside it?
5. What accessibility and responsive behavior does PADS need to guarantee?

If the answer depends on one product's route, DTO, quota, permission, provider,
or workflow state, keep the behavior in that product and compose PADS parts.

## Hierarchy

### Primitives

Primitives own one focused visual or interaction contract. Examples include
Button, IconButton, Link, Text, Heading, ProductMark, Avatar, Badge, Divider,
Field, Input, Textarea, Checkbox, Radio, Switch, Select, Combobox, Segmented,
Progress, Spinner, Loader, Skeleton, Tooltip, Popover, Menu, Dialog, Drawer, Tabs,
Pagination, Table, and Upload.

Complex ARIA behavior belongs here so product teams do not rebuild it.

### Composites

Composites combine primitives into compact reusable units, such as Card,
EmptyState, ErrorState, LoadingState, FileUpload, SearchTrigger, ActionCard,
MetricCard, UsageCard, PageHeader, and StatusSummary.

### Patterns

Patterns implement recurring workflows while leaving business state with the
consumer. Examples include CommandPalette, SettingsPanel, SettingsGroup,
SettingsActionRow, ComposerDock, ContextPalette, MediaGrid, MediaPreview,
ReferenceCard, MaskEditor, and comparison surfaces.

### Layouts

Layouts own geometry and responsive relationships through slots: Stack, Inline,
Grid, Container, SplitPane, DashboardLayout, SettingsLayout, and WorkspaceShell.
They do not import routers or render product navigation from a private registry.

### Templates

Templates compose a complete product-neutral surface such as a dashboard,
settings area, authentication frame, conversation, editor, media studio, or
reader. Templates contain no network calls and do not pretend placeholder
business behavior is production behavior.

## Directory convention

Each public component owns a directory:

```text
Button/
├── Button.tsx
├── Button.module.css
├── Button.test.tsx
├── Button.stories.tsx
├── Button.types.ts        # only when types warrant a separate file
└── index.ts
```

Keep implementation helpers private to the directory until they are genuinely
reused. Avoid general `utils` directories that hide component ownership.

## Public API design

- Use the smallest semantic API that supports real use cases.
- Prefer named variants such as `primary`, `secondary`, `quiet`, and
  `destructive` over appearance props such as arbitrary colors.
- Accept `ReactNode` slots when consumers need structured content. Avoid dozens
  of optional booleans that create invalid combinations.
- Preserve native attributes and event semantics. Do not rename `disabled`,
  `required`, or `aria-*` concepts without a strong reason.
- Make controlled and uncontrolled modes explicit; never switch between them
  during a component's lifetime.
- Expose refs when consumers reasonably need focus, measurement, or form
  integration.
- Event callbacks describe the PADS semantic event and do not expose an
  implementation-library object.
- Public types are exported from documented entry points and contain no Ant
  Design types.
- Defaults are safe, accessible, and documented.
- Reject or make impossible invalid combinations where practical.

Do not add arbitrary `className` or style escape hatches as a substitute for a
missing design-system capability. A root `className` may be supported for layout
integration, but internal slots remain owned unless a reviewed slots API exists.

## Ant Design adapter

Ant Design provides implementation mechanics behind the main package. All Ant
imports live under `packages/react/src/internal/antd` or a documented equivalent
internal adapter. Wrappers must:

- translate PADS-owned props into Ant props;
- normalize theme-aware overlay roots and static APIs;
- prevent Ant types and class names from entering declarations;
- supply PADS defaults, labels, focus, state, and styling;
- use direct tree-shakable module entry points;
- include behavior tests that would remain valid if the implementation changed.

Product code must never need a page-level `.ant-*` override. Fix the wrapper,
token adapter, or public capability instead.

## Styling

- Consume semantic or component CSS custom properties.
- Use CSS Modules for local rules and low-specificity selectors.
- Use logical properties so layout is direction-safe.
- Prefer intrinsic sizing; avoid fixed content heights.
- Use container queries when behavior depends on the allocated component width.
- Tokenize recurring spacing, typography, radius, shadow, motion, and layers.
- Do not use raw hex/rgb colors, `!important`, arbitrary z-index values, or
  inline presentation styles.
- Keep hover enhancements optional; the component must remain complete on touch.
- Honor reduced motion and forced colors in the component stylesheet.

## Component state contract

Document and test every meaningful state rather than manufacturing states that
do not apply. The review checklist includes:

- default, hover, focus-visible, active, selected;
- disabled and read-only;
- loading and pending action;
- empty and zero data;
- success, informational, warning, validation error, system error;
- destructive confirmation;
- long content, localization expansion, truncation, and wrapping;
- light/dark mode and relevant brands;
- narrow, medium, and wide containers;
- reduced motion and forced colors.

Loading controls preserve their accessible name, prevent accidental duplicate
submission when required, and expose progress appropriately. Disabled styling
must not be used to hide why an action is unavailable.

## Responsive behavior

Components work from a 320px viewport upward and inside narrower layout slots
where reasonable. Define behavior, not only breakpoints:

- what wraps, stacks, scrolls, collapses, or becomes a menu;
- which content retains priority;
- how focus remains visible in overflow regions;
- how overlays respond to visual viewport and software keyboards;
- whether data tables offer scrolling, column priority, or an alternate layout.

DOM order remains logical at every visual arrangement.

## Content and icons

Use concise sentence-case labels. Icon-only controls need a stable accessible
name. Icons reinforce meaning and are hidden from assistive technology when
their adjacent text already conveys it. Do not expose a third-party icon type in
the public API; accept a PADS icon contract or React node.

Error components accept actionable product copy rather than hard-coding network
assumptions. See [content-design.md](content-design.md).

## Documentation definition of done

Every stable component includes:

- purpose and non-goals;
- anatomy and variants;
- all meaningful state stories;
- a controls/API reference;
- keyboard and accessibility behavior;
- content guidance;
- responsive examples;
- light and dark examples;
- at least one realistic composition;
- known constraints and migration notes.

Story examples use documented package imports, deterministic data, and no production
credentials or personal information.
