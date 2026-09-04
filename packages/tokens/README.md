# `@praabindh/aura-tokens`

The framework-independent token foundation for Praabindh's Aura Design System
(PADS), a PRAABINDH CORP project.

The DTCG 2025.10 source in `src/aura.tokens.json` is canonical. CSS, JavaScript,
TypeScript declarations, and resolved JSON are deterministic generated
artifacts; do not edit `dist` directly.

## Use

```ts
import {
  auraBrands,
  browserThemeColor,
  getThemeTokens,
  resolveThemePreference,
  type AuraBrand,
  type ThemeMode,
  type ThemePreference,
} from "@praabindh/aura-tokens";
import "@praabindh/aura-tokens/styles.css";
```

Set `data-aura-theme` and `data-aura-brand` on the document root. A nested
theme boundary may use `data-aura-scope` with the same theme and brand
attributes. When no explicit theme is present, generated CSS follows
`prefers-color-scheme`; `resolveThemePreference` provides the equivalent
runtime contract.

Supported themes are `light` and `dark`; the persisted preference additionally
supports `system`. Supported brands are Aura, VerbAura, CognAura, RendAura,
CharterAura, and CharterAura Intermediate.

```ts
const tokens = getThemeTokens("dark", "cognaura");
Object.entries(tokens).forEach(([name, value]) => {
  document.documentElement.style.setProperty(name, value);
});
```

Product marks are emitted for every brand in every resolved map, allowing a
product switcher to show several branded marks without nesting providers.

## Quality contract

`npm run check` validates DTCG structure, alias resolution, mode and brand key
parity, WCAG 2.2 contrast pairs, raw-color ownership, and generated-file drift.
The build is dependency-free and stable across machines.
