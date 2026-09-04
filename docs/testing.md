# Testing strategy

PADS uses layered evidence. A snapshot cannot prove keyboard behavior, a unit
test cannot prove CSS layout, and an automated accessibility scan cannot prove
WCAG conformance.

## Test layers

### Token tests

Token tests verify:

- schema and type validity;
- reference resolution without cycles;
- required semantic roles for every theme and brand;
- stable generated names;
- contrast-critical foreground/background pairs;
- valid dimensions, durations, and layer ordering;
- deterministic generated output.

### Unit tests

Use unit tests for pure mapping, formatting, token adapters, invariant checks,
and reducer-like behavior. They should be fast and independent of CSS layout.

### Browser component tests

Interactive components run in a real browser through Vitest and Playwright.
Test behavior visible to users:

- keyboard and pointer interaction;
- focus entry, containment, movement, and restoration;
- controlled and uncontrolled value changes;
- loading, validation, empty, disabled, and destructive behavior;
- overlay placement and dismissal;
- meaningful browser APIs and CSS-dependent behavior.

Use role, accessible name, label, and visible text queries. Avoid selecting
implementation class names or Ant internals.

### Storybook interaction and accessibility tests

Each public component has deterministic stories for all meaningful states.
Stable stories run interaction tests and axe with accessibility violations
configured as errors. Storybook build failure, browser console error, or missing
story is a release failure.

### Visual regression tests

Visual baselines protect geometry, type, theme, focus, and responsive behavior.
Capture a controlled matrix rather than every combinatorial possibility:

- light and dark modes;
- the neutral/default brand plus each affected brand;
- 320/375px, 768px, 1024px, and 1440px representative viewports;
- focus, open overlay, selected, loading, empty, error, and disabled states when
  visually meaningful;
- reduced motion and forced colors for components that customize them.

Fonts, dates, animation, random values, network access, and timers must be
deterministic. Reviewers inspect diffs before accepting new baselines.

### Package integrity tests

For every publishable package:

1. build from a clean workspace;
2. inspect `npm pack --dry-run` output;
3. lint package metadata and exports with Publint;
4. validate declaration/module resolution with Are the Types Wrong;
5. install the packed artifact in the consumer fixture;
6. typecheck and production-build that fixture;
7. assert the base package dependency graph and shipped output exclude optional
   chart and rich-content runtimes;
8. enforce package and representative bundle budgets.

Source-only workspace imports are insufficient evidence because npm tarballs can
omit CSS, declarations, fonts, or package metadata.

The initial raw/gzip runtime ceilings are 140/25 kB for the React package,
36/8 kB for charts, 28/8 kB for rich content, 135/8 kB for the token runtime,
and 270/12 kB for the complete token stylesheet. These are pre-dependency
package ceilings measured deterministically by `npm run bundle:check`; a budget
change requires recorded performance evidence.

## Coverage policy

Published implementation code targets at least:

- 80% statements;
- 80% lines;
- 80% functions;
- 75% branches.

Coverage is a floor, not a substitute for state and interaction coverage. New
packages may establish an initial ratchet in an ADR, but the ratchet may not
decrease without a time-bounded remediation decision.

## Accessibility verification

Automated axe scans, semantic assertions, keyboard tests, and token contrast
checks run in CI. Complex widgets also require manual assistive-technology
evidence described in [accessibility.md](accessibility.md).

Never suppress an axe rule globally. A narrow exception needs an issue or ADR
that explains the limitation, user impact, owner, and removal condition.

## Cross-browser policy

Pull requests run a representative Chromium path. Release and scheduled suites
exercise Chromium, Firefox, and WebKit for stable interactive components.
Browser-specific fixes require a regression test on the affected engine.

See [browser-support.md](browser-support.md) for the supported consumer matrix.

## Test data and privacy

- Use fictional names, emails, documents, and assets.
- Never copy production data, tokens, cookies, screenshots containing personal
  data, or private product fixtures into stories.
- Do not call paid or production providers.
- Replace network behavior with deterministic local fixtures.
- Test error and slow paths explicitly without arbitrary sleeps.

## Root verification

`npm run verify` is the authoritative completion gate. It should compose, in a
stable order:

1. format check;
2. code, story, and style linting;
3. architecture, local credential-pattern, and generated-token checks;
4. type checking, declaration builds, and export-contract checks;
5. unit and browser tests with coverage;
6. package and Storybook builds;
7. accessibility and visual regression checks;
8. package integrity and packed-consumer builds;
9. bundle budgets and production dependency audit.

Individual workspace scripts are useful while developing, but a passing subset
does not replace the root gate.

## Pull request evidence

For a visual or interactive change, include:

- tests added or changed;
- relevant Storybook story links or names;
- light and dark screenshots;
- affected brand and viewport evidence;
- keyboard path exercised;
- manual accessibility notes when required;
- package/API/bundle impact;
- the full `npm run verify` result.
