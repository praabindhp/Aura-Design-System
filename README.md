# Praabindh's Aura-Design-System (PADS)

**One polished, accessible design language for every Aura product.**

Praabindh's Aura-Design-System (PADS), also referred to as the Aura Design
System (ADS), is the shared visual and interaction foundation for PRAABINDH CORP
Aura products. It provides framework-independent design tokens, production-grade
React components, responsive layouts, product-neutral templates, accessible
data visualizations, and the documentation and quality gates needed to evolve
them safely.

PADS is built from the strongest reusable patterns in VerbAura, CognAura,
RendAura, and CharterAura. Product code remains independent: this repository
contains no product routes, business state, services, credentials, or local-path
dependencies on those applications.

## What PADS guarantees

- A coherent Aura visual language across light, dark, and system themes.
- Semantic brand recipes for VerbAura, CognAura, RendAura, and CharterAura.
- WCAG 2.2 AA as a release requirement, including keyboard operation, visible
  focus, reduced motion, forced colors, touch targets, and 200% zoom.
- Stable, typed public APIs that do not expose Ant Design implementation details.
- Responsive components designed for narrow mobile containers through large
  desktop workspaces.
- Synchronized, versioned npm packages with reviewed declaration contracts,
  reproducible builds, package-integrity checks, and restricted CI releases.

## Packages

| Package                         | Responsibility                                                               |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `@praabindh/aura-tokens`        | DTCG-compatible tokens and generated CSS, JSON, and TypeScript artifacts     |
| `@praabindh/aura-design-system` | Providers, primitives, composites, patterns, layouts, and templates          |
| `@praabindh/aura-charts`        | Accessible charts and usage visualizations without burdening the base bundle |
| `@praabindh/aura-rich-content`  | Safe Markdown, code, and long-form content presentation                      |
| `@praabindh/aura-testing`       | Consumer render helpers, browser mocks, and accessibility utilities          |

All publishable packages use a synchronized `1.0.0` release baseline and move
together on the PADS release train. See [architecture](docs/architecture.md) for
dependency direction and public API rules.

## Installation

The repository and its npm packages are private PRAABINDH CORP assets. Configure
authorized access to the restricted `@praabindh` npm scope, then install the
package needed by the product rather than copying component source:

```bash
npm install @praabindh/aura-design-system
```

Import the PADS stylesheet once at the application entry point, then provide the
active appearance and brand at the application boundary:

```tsx
import {
  AuraProvider,
  Button,
  type AuraBrand,
  type ThemePreference,
} from "@praabindh/aura-design-system";
import "@praabindh/aura-design-system/styles.css";

export function Application({
  brand,
  preference,
}: {
  brand: AuraBrand;
  preference: ThemePreference;
}) {
  return (
    <AuraProvider brand={brand} theme={preference}>
      <Button variant="primary">Create project</Button>
    </AuraProvider>
  );
}
```

`ThemePreference` accepts `"light"`, `"dark"`, or `"system"`. Use
`defaultTheme` instead of `theme` when the provider should own the current
preference as uncontrolled state.

The published package README and export map are authoritative for a released
version. Do not deep-import package internals.

## Design model

PADS separates decisions so products consume meaning instead of hard-coded
appearance:

```text
reference values -> semantic roles -> brand recipes -> component decisions
```

Reference values describe the palette, type, spacing, radius, shadow, motion,
and layering scales. Semantic tokens describe roles such as canvas, elevated
surface, primary text, subtle border, primary action, and danger status. Brand
recipes map those roles to quiet, contrast-safe Aura colors. Component tokens
capture only decisions that truly belong to a component.

Components follow a practical hierarchy:

- **Primitives** provide focused controls and visual building blocks.
- **Composites** combine primitives into reusable interface units.
- **Patterns** solve recurring workflows without product data or navigation.
- **Layouts** own responsive geometry through typed slots.
- **Templates** compose complete product-neutral surfaces such as dashboards,
  settings, conversations, editors, readers, and media studios.

Read [tokens and theming](docs/tokens-and-theming.md) and
[component standards](docs/component-standards.md) before adding visual or
interaction behavior.

## Development

Requirements:

- Node.js 22.14 or newer
- npm 11.18.0 or newer
- Git

```bash
npm ci
npm run build
npm run storybook
npm run verify
```

`npm run verify` is the completion gate. It covers formatting, linting,
architecture boundaries, local credential screening, token generation and
contrast, type checking, tests, coverage, Storybook, accessibility, package
builds, bundle budgets, and packed-consumer integrity.

## Showcase and component explorer

The repository includes an interactive PADS showcase, a searchable catalog of
all 88 public components, foundations, and setup guidance. It supports six brand
recipes and light, dark, and system appearance, with the full Storybook embedded
for detailed examples.

```bash
npm run docs:build
npm run docs:preview
```

The GitHub Pages workflow deploys verified changes from `main`. See
[showcase and hosting](docs/showcase.md) for Pages activation, local development,
URL structure, and maintenance.

## Documentation

- [Architecture](docs/architecture.md)
- [Tokens and theming](docs/tokens-and-theming.md)
- [Component standards](docs/component-standards.md)
- [Component catalog](docs/component-catalog.md)
- [Accessibility](docs/accessibility.md)
- [Testing](docs/testing.md)
- [Browser support](docs/browser-support.md)
- [Content design](docs/content-design.md)
- [Governance](docs/governance.md)
- [Product migration](docs/migration.md)
- [Source provenance](docs/source-provenance.md)
- [Releasing](docs/releasing.md)
- [Architecture decisions](docs/adr/README.md)

## Contributing

Read [AGENTS.md](AGENTS.md) and [CONTRIBUTING.md](CONTRIBUTING.md) before making
a change. Consumer-visible changes require tests, stories, documentation, and a
Changeset. Security reports must follow [SECURITY.md](SECURITY.md).

## Authorship and stewardship

PADS is **Praabindh's Aura-Design-System**, authored and stewarded by
**Praabindh** as a **PRAABINDH CORP** project. It is the design-system foundation
for the Aura product family.

## License

Licensed under the [MIT License](LICENSE). Copyright (c) 2026 Praabindh,
PRAABINDH CORP.
