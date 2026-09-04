# Architecture

## Purpose

PADS is a standalone, multi-brand design-system monorepo. It turns reviewed
design decisions into versioned artifacts that Aura products can consume
without copying styles or depending on another product repository.

The architecture optimizes for five properties:

1. one source of truth for visual decisions;
2. stable product-neutral component contracts;
3. accessible behavior supplied by default;
4. independently loadable optional capabilities;
5. reproducible, reviewable releases to a restricted registry scope.

## System context

```text
Token sources
    |
    v
@praabindh/aura-tokens
    |
    +-----------------------------+
    |                             |
    v                             v
@praabindh/aura-design-system   optional packages
    |                           charts / rich-content
    +-------------+---------------+
                  |
                  v
       Aura product applications
```

Product applications decide what data exists, who may act on it, which route is
active, and how state is persisted. PADS decides how shared interface concepts
look, respond, announce themselves, and adapt to available space.

## Workspaces

### `@praabindh/aura-tokens`

The token package is framework-independent. Its reviewed source uses
DTCG-compatible token objects and generates:

- CSS custom properties and theme selectors;
- typed JavaScript/TypeScript token maps;
- portable JSON for design and non-React consumers;
- implementation-adapter values used by the component package.

Generated outputs are never hand-edited. Alias resolution, unresolved
references, duplicate output names, and contrast-critical pairs are validated
before publication.

### `@praabindh/aura-design-system`

This is the primary React package. It owns:

- `AuraProvider` and appearance/brand context;
- accessible controls and feedback primitives;
- shared composites and product-neutral workflow patterns;
- responsive layout primitives and templates;
- the internal Ant Design adapter.

Ant Design is an implementation dependency rather than the public contract.
Consumers neither import Ant directly for PADS concepts nor receive Ant types
from PADS exports. This allows implementation upgrades without forcing
unrelated consumer rewrites.

### `@praabindh/aura-charts`

Charts are separate so applications that do not visualize data do not pay their
runtime cost. The package owns chart geometry, legends, tooltips, responsive
behavior, empty states, tabular alternatives, and semantic series tones.
Consumers provide data, labels, units, and product meaning.

### `@praabindh/aura-rich-content`

Rich-content dependencies are also isolated. This package owns safe Markdown,
code presentation, copy actions, editor chrome, and long-form content styles.
Unsafe HTML is disabled by default. Product-specific document models,
persistence, autosave, citations, and AI behavior remain in products.

### `@praabindh/aura-testing`

Testing helpers reproduce the real provider stack without hiding user behavior.
The package may expose a `renderWithAura` helper, deterministic observers and
media-query controls, and reusable accessibility assertions. It must not turn
implementation details into supported testing APIs.

### Documentation and consumer applications

`@praabindh/aura-docs` is a private Storybook application. It imports public
package entry points and presents foundations, component stories, interaction
tests, accessibility notes, design guidance, and full templates.

`@praabindh/aura-consumer-vite` is a private integration fixture. CI installs or
packs the same artifacts a real consumer receives, imports only documented
exports, and builds a minimal application. This catches missing files, invalid
export maps, accidental source imports, peer dependency mistakes, and CSS
packaging failures.

## Dependency rules

Allowed dependencies flow toward foundations:

```text
docs / consumer -> charts / rich-content / design-system -> tokens
testing -> design-system -> tokens
```

The following are forbidden:

- a published package depending on an application workspace;
- a package depending on a sibling product repository, local path, symlink, or
  Git submodule;
- PADS depending on product transport contracts;
- the token package depending on React, Ant Design, or DOM APIs;
- the main package importing optional chart or rich-content runtimes;
- product identifiers or route rules embedded in component implementation.

## Component layers

The hierarchy describes responsibility, not visual size:

- **Primitives**: one focused behavior, such as Button, TextField, Badge, or
  Dialog.
- **Composites**: small reusable combinations, such as EmptyState, FileUpload,
  SearchTrigger, or MetricCard.
- **Patterns**: recurring interaction models, such as ComposerDock,
  SettingsPanel, CommandPalette, or MediaGrid.
- **Layouts**: responsive geometry exposed through slots, such as Stack,
  SplitPane, DashboardLayout, or WorkspaceShell.
- **Templates**: complete product-neutral compositions with no data fetching or
  route ownership.

Each public component has one owning directory containing implementation,
styles, behavior tests, stories, and its local export. Package root barrels are
explicit; wildcard deep imports are not part of the contract.

## Public API rules

- Export maps enumerate every supported entry point.
- The package is ESM-first and emits `.d.ts` declarations and source maps.
- Public APIs use PADS-owned types and semantic variant names.
- Relevant native DOM attributes and refs remain available.
- Required provider context fails with an actionable development error.
- Browser globals are not accessed at module evaluation time, preserving SSR
  import safety.
- CSS is explicitly exported and marked as a side effect so production bundlers
  retain it.
- Optional entry points do not load when unused.
- TypeScript declaration builds, Publint, and Are the Types Wrong make public
  surface and packaging defects visible in review.

## Styling architecture

CSS Modules own component rules. Global output is restricted to:

- generated design-token selectors;
- an explicitly imported, low-specificity reset;
- font-face declarations;
- documented provider-level color-scheme behavior.

Component selectors do not rely on generated Ant class names outside the
internal adapter. Products do not override `.ant-*` selectors or use
`!important`; PADS fixes the adapter or exposes a semantic capability instead.

Prefer CSS logical properties, grid/flex layout, intrinsic sizing, and container
queries. Viewport media queries are reserved for true application-viewport
behavior. Breakpoint numbers remain token-source decisions even when CSS syntax
requires their generated literal values.

## Theme application

Generated selectors use explicit attributes such as `data-aura-theme` and
`data-aura-brand`. The provider can scope those attributes to an application
root, allowing multiple brands or themes in documentation and embedded
surfaces. A separately exported initialization helper may apply the saved or
system appearance before React hydration to avoid a theme flash.

The provider may synchronize browser chrome only through an explicit option. It
must not silently own consumer persistence keys, document titles, favicons, or
product metadata.

## Performance and compatibility

- React and React DOM are peer dependencies to avoid duplicate runtimes.
- Ant Design belongs to the main package as an internal implementation
  dependency.
- Charts and rich content remain optional packages.
- Direct, tree-shakable module imports are used inside adapters.
- Bundle budgets cover each public entry and representative consumer builds.
- Node support starts at 22.14; browser policy is defined in
  [browser-support.md](browser-support.md).

## Decisions and exceptions

Cross-package dependencies, new global behavior, public API conventions, token
model changes, and architecture exceptions require an ADR. An exception must
name an owner, risk, expiry or removal condition, and verification plan.
