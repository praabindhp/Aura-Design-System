# ADR-0005: Publish the PADS showcase with Storybook on GitHub Pages

- Status: Accepted
- Date: 2026-09-16
- Owner: Praabindh
- Review or removal date: Not applicable
- Related issues: Owner request to showcase the repository's component library

## Context

PADS has package documentation and Storybook but no cohesive showcase or
searchable visual catalog. Its previous documentation workflow only uploaded an
authenticated build artifact. The owner requested a distinctive GitHub Pages
site built from this repository.

## Decision drivers

- Demonstrate actual PADS components and preserve stable public imports.
- Support all brand recipes, appearance preferences, and accessible interactions.
- Keep documentation deployable from a clean, locked repository checkout.
- Preserve published package boundaries and restricted registry access.

## Decision

Keep the showcase inside `apps/docs` as a Vite entry point. Publish the showcase
and existing Storybook as one static artifact, with Storybook under `storybook/`.
Use hash routes and relative assets for project-site hosting without server
rewrites. Validate catalog coverage against public exports and story references
against Storybook's generated index during assembly.

Deploy the verified `main` commit with GitHub's official Pages actions. Source
visibility and package publication remain separate settings. The repository
owner must activate Pages using the GitHub Actions publishing source.

## Alternatives considered

### Storybook as the only landing page

Retains technical depth but does not provide the requested product-quality
showcase and browsable component cards. Storybook remains the detailed canvas.

### A separate site package or external hosting service

Adds a second documentation owner or hosting dependency. The existing docs
application can own both entry points without changing package responsibilities.

## Consequences

### Positive

The site demonstrates the library directly, catalog drift becomes a build error,
and deployment follows the existing quality gate.

### Negative and risks

The complete static documentation and its built examples become visible to the
Pages audience. Site availability depends on repository settings and the owner's
GitHub plan. The showcase loads enough components to demonstrate a broad library;
its bundle is not representative of a minimal consumer application.

### Accessibility

Retain native controls, visible labels, keyboard focus, semantic tokens, and
reduced-motion and forced-colors behavior. Use isolated Storybook frames for
whole-page landmarks. Test responsive reflow, themes, and keyboard interactions.

### Compatibility and migration

No published API changes or package version bump. Existing Storybook is served
under a documented subpath. Reverting the documentation change rolls back the
site through the normal verification and deployment workflow.

### Security and privacy

No product backend, telemetry, analytics, or additional external runtime service.
Only appearance preferences are persisted locally. Deployment uploads the built
documentation artifact and uses least-privilege job permissions. The repository
and restricted npm scope are not made public as part of this decision.

## Verification

Full repository verification; exact export coverage; valid Storybook references;
production subpath tests; all appearance recipes; keyboard and responsive checks;
packed-package consumer validation. Live deployment must be confirmed separately
from the build.

## Follow-up

- Maintainer: activate GitHub Pages and verify the deployment environment URL.

## Supersession

None.
