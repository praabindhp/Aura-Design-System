# PADS Engineering Contract

This file is mandatory guidance for every human and AI contributor working in
this repository. Read it before inspecting or changing implementation code.

Praabindh's Aura Design System (PADS) is the shared visual and interaction
contract for PRAABINDH CORP Aura products. A design-system regression can affect
many products at once, so compatibility, accessibility, and release discipline
are part of correctness.

## Tenets

1. Preserve consumer trust. Do not regress behavior, accessibility, privacy,
   performance, or documented APIs.
2. Keep one source of truth. Design-token source files generate every CSS,
   TypeScript, JSON, and Ant Design theme artifact.
3. Keep product logic out. PADS accepts data, callbacks, and slots; it does not
   own routes, authentication, API clients, stores, product contracts, or
   business rules.
4. Hide implementation dependencies. Ant Design is an internal adapter, never
   a public component, type, class name, static API, or consumer requirement.
5. Style semantically. Components consume semantic or component tokens, never
   raw palette values, arbitrary dimensions, `!important`, or inline
   presentation styles.
6. Treat accessibility as a contract. Meet WCAG 2.2 AA, support keyboard and
   assistive technology, keep focus visible, honor user preferences, and never
   communicate status through color alone.
7. Prefer composition over configuration sprawl. Public APIs should be small,
   typed, predictable, and useful across at least two product contexts.
8. Make responsive behavior intrinsic. Components own their container-aware
   behavior from 320px upward and remain usable at 200% zoom.
9. Ship observable quality. Stories, interaction tests, accessibility checks,
   visual baselines, declaration/export contract checks, and package-consumer
   tests are release evidence.
10. Evolve through SemVer. Breaking changes require an ADR, a migration path,
    and a major release; deprecations remain functional for a documented window.

## Repository boundaries

- `packages/tokens`: framework-independent reference, semantic, brand, and
  component tokens plus generated artifacts.
- `packages/react`: providers, primitives, composites, patterns, layouts, and
  product-neutral templates. Only its internal Ant adapter may import Ant
  Design.
- `packages/charts`: accessible, optional chart components built from PADS
  tokens and primitives.
- `packages/rich-content`: optional editor, Markdown, code, and rich-content
  presentation.
- `packages/testing`: consumer-facing render helpers and deterministic browser
  mocks.
- `apps/docs`: Storybook documentation and interaction examples. It may consume
  packages; packages may never depend on it.
- `apps/consumer-vite`: a minimal packed-package consumer used to verify exports,
  styles, peer dependencies, and tree shaking.
- `tooling`: repository-only lint, build, validation, and release configuration.
- `docs`: architecture, policy, adoption, and ADRs.

If a package is not yet present, this boundary reserves its responsibility; do
not place that responsibility in an unrelated package as a shortcut.

## Dependency direction

The allowed direction is:

```text
apps -> charts / rich-content / react -> tokens
apps -> testing
```

No published package may depend on an Aura product repository or
`@praabindh/contracts`. No local path, symlink, submodule, or unpublished sibling
repository may be required to build, test, document, or publish PADS.

React and React DOM are peer dependencies. Implementation libraries belong to
the package that owns them and are pinned to tested versions in this repository.
Public types must be owned by PADS instead of re-exporting third-party types.

## Required change workflow

Before coding, identify:

- the owning package and component tier;
- the public API and compatibility impact;
- affected token aliases and supported brands;
- light, dark, system, responsive, loading, empty, error, disabled, read-only,
  selected, and destructive states that apply;
- keyboard, screen-reader, focus, forced-colors, reduced-motion, zoom, and touch
  behavior;
- bundle, SSR, security, privacy, and migration risks;
- the smallest tests and stories that prove success.

During implementation:

- Import Ant Design only from `packages/react/src/internal/antd` or an explicitly
  approved equivalent adapter path.
- Use CSS Modules for component styles. Global CSS is limited to an opt-in reset,
  font declarations, generated tokens, and documented provider behavior.
- Use logical properties and container queries where component behavior depends
  on available space. Do not encode a product page's width into a primitive.
- Forward relevant DOM attributes and refs, preserve native semantics, and keep
  controlled and uncontrolled behavior intentional.
- Name public types and callbacks in product-neutral language.
- Add or update a colocated story and behavior test for every public component
  change.
- Add a Changeset for every consumer-visible change. Documentation-only and
  internal test changes may omit one when they cannot affect published output.
- Do not suppress a quality rule without a time-bounded ADR naming an owner and
  removal condition.

Before completion:

1. Run `npm run verify` from the repository root.
2. Review changed UI in light and dark themes and every affected brand.
3. Exercise keyboard, focus, loading, empty, error, disabled, and destructive
   paths as applicable.
4. Review supported responsive widths and 200% zoom.
5. Inspect the packed published package rather than relying only on source
   tests.
6. Update declaration and export contracts, stories, documentation, migration
   notes, and Changesets with the implementation.

## Public API and release rules

- Consumers import only documented package entry points. Deep imports into
  `src` or `dist` are unsupported and must be blocked by export maps.
- Stable APIs cannot be removed or behaviorally redefined in a minor or patch
  release.
- Experimental APIs must be visibly marked and isolated from stable exports.
- Deprecations include a replacement, migration example, and target removal
  release.
- Generated files are produced by repository scripts; never hand-edit them.
- Release jobs use immutable lockfiles, package-integrity checks, and
  least-privilege credentials for the restricted PRAABINDH CORP registry scope.

## Design review evidence

A component is not complete until its documentation demonstrates:

- purpose, non-goals, anatomy, and content guidance;
- variants, sizes, and all meaningful states;
- keyboard model and accessibility notes;
- light and dark themes plus relevant brand contexts;
- narrow, medium, and wide containers;
- correct and incorrect usage;
- API reference and migration notes when replacing an older pattern.

Architecture decisions with cross-package or long-term consequences belong in
`docs/adr`. Use `docs/adr/0000-template.md` and keep decisions small enough to
reverse.
