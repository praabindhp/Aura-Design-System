# ADR-0001: Publish PADS as bounded packages

- Status: Accepted
- Date: 2026-09-04
- Owner: Praabindh
- Review or removal date: Not applicable

## Context

Aura products currently contain reusable visual foundations alongside product
features. Copying those foundations causes drift, while publishing every
capability in one entry makes basic consumers pay for charts, editors, Markdown,
and their dependencies.

PADS must be independently buildable and cannot depend on a product checkout.

## Decision

Use an npm-workspace monorepo with these public boundaries:

- `@praabindh/aura-tokens` for framework-independent design decisions;
- `@praabindh/aura-design-system` for the primary React system;
- `@praabindh/aura-charts` for optional visualization runtime;
- `@praabindh/aura-rich-content` for optional editor and content runtime;
- `@praabindh/aura-testing` for consumer test helpers.

Storybook documentation and the packed Vite consumer are private applications.
Published packages may depend only toward foundations and may not depend on Aura
product repositories or contracts.

## Alternatives considered

### One package with every runtime

This offers one install name but risks loading or resolving heavy optional
dependencies for products that do not use them.

### Separate repositories

This isolates ownership but makes coordinated token, component, documentation,
and release changes harder and increases version drift.

### Continue copying product-local code

This avoids initial publishing work but fails the primary consistency and
maintenance goal.

## Consequences

Products can install only what they use, and package boundaries make bundle
costs visible. Coordinated changes require Changesets to update internal ranges
and release notes correctly. Integration fixtures must test packages together.

## Verification

- Architecture lint rejects reverse, sibling, local-path, and product-contract
  dependencies.
- Package lint and packed-consumer builds validate each published artifact.
- Bundle tests prove the primary package does not load optional runtimes.
