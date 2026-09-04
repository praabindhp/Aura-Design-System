# Contributing to PADS

Thank you for helping improve Praabindh's Aura Design System (PADS). Changes to
this repository can reach every PRAABINDH CORP Aura product, so a contribution
must be reusable, accessible, compatible, documented, and proportionately
tested.

## Before starting

1. Read [AGENTS.md](AGENTS.md), [architecture](docs/architecture.md),
   [component standards](docs/component-standards.md), and
   [accessibility requirements](docs/accessibility.md).
2. Search existing issues, components, tokens, and ADRs before proposing a new
   concept.
3. Identify at least two product contexts for a shared pattern. Product-specific
   behavior belongs in the product, not PADS.
4. For a public API, cross-package dependency, token model, or behavior change,
   open a proposal or ADR before implementation.

Bug fixes and small documentation corrections may go directly to a pull request
when the expected behavior is already clear.

## Local setup

Use the repository's declared Node and npm versions and preserve the committed
lockfile.

```bash
npm ci
npm run build
npm run storybook
```

Do not link unpublished sibling repositories or copy a product's `node_modules`.
The repository must build on a clean machine using only committed source and
registry dependencies.

## Making a change

### Tokens

- Change the DTCG-compatible source token, never generated output.
- Prefer an existing semantic role over exposing a raw palette stop.
- Check every supported appearance and brand.
- Add contrast or invariant tests for any new foreground/background pairing.
- Document consumer impact; token removals and semantic changes are breaking.

### Components

- Place the component in the smallest correct tier: primitive, composite,
  pattern, layout, or template.
- Keep data fetching, routes, stores, product names, permissions, quotas, and
  business validation outside the component.
- Use owned PADS props and types; do not leak Ant Design or other implementation
  types.
- Colocate implementation, CSS Module, tests, stories, and public exports.
- Cover keyboard interaction, focus, states, themes, responsive behavior, and
  reduced motion where applicable.
- Add TSDoc to public types and non-obvious behavior.

### Documentation

Document purpose, anatomy, API, content guidance, accessibility, responsive
behavior, and correct/incorrect use. Examples must use public imports exactly as
a consumer would.

## Tests and verification

Use the smallest test that proves the contract, then add higher-level evidence
for integration-critical behavior.

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
```

The exact test layers and visual matrix are defined in
[docs/testing.md](docs/testing.md). Never update a visual snapshot merely to make
CI green; inspect the rendered difference in every affected theme and brand.

## Changesets and versioning

Every consumer-visible change needs a Changeset:

```bash
npm run changeset
```

- **Patch**: compatible fixes, documentation shipped in a package, and visual
  corrections that preserve the contract.
- **Minor**: new backward-compatible components, variants, tokens, or APIs.
- **Major**: removed or renamed exports, changed required props, removed tokens,
  or materially changed documented behavior.

Describe the consumer outcome and migration need, not implementation activity.
See [releasing](docs/releasing.md) for the complete policy.

## Pull requests

Keep pull requests focused and include:

- the consumer-visible outcome and owning package;
- public API and SemVer assessment;
- screenshots for visual changes in light and dark modes and relevant brands;
- keyboard and screen-reader notes;
- responsive and 200% zoom evidence;
- test, Storybook, package, and bundle evidence;
- a Changeset or a clear explanation for why none is required;
- an ADR for an approved exception.

Use clear commits. Do not mix unrelated cleanup with behavior changes. Generated
files, lockfile changes, and declaration/export contract artifacts must
correspond exactly to the source change.

## Review and conduct

Maintainers may request API simplification, stronger evidence, or product-side
implementation when a proposal is not demonstrably shared. All participation is
governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
