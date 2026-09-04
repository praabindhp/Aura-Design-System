# Product migration guide

This guide describes a future migration from product-local design-system code to
published PADS packages. Creating PADS does not authorize changes to VerbAura,
CognAura, RendAura, CharterAura, or another product repository.

## Migration principles

- Migrate incrementally behind existing product behavior.
- Preserve routes, data, APIs, accessibility, and visual intent.
- Replace one source of truth at a time; do not leave permanent duplicate token
  or component ownership.
- Use public PADS exports only.
- Keep product state and business logic in the product.
- Verify light, dark, responsive, keyboard, and failure paths at each slice.

## 1. Inventory the product

Record:

- local tokens, theme persistence, font loading, and global CSS;
- direct Ant Design imports and `.ant-*` overrides;
- primitives, shared components, layouts, and templates;
- product-specific components that should remain local;
- visual and end-to-end baselines for critical workflows;
- bundle and browser baselines.

Map each local concept to an existing PADS component or an explicit product-owned
exception. Do not request a new shared component merely to avoid adapting local
business code.

## 2. Install foundations

Add exact compatible PADS package versions through the product's package
manager. Import the documented stylesheet once, self-host the required font, and
wrap the application in `AuraProvider` using the product's brand and appearance
preference.

Keep the product's existing theme store as the owner initially. It passes the
`ThemePreference` value through the `theme` prop and its `AuraBrand` through the
`brand` prop; PADS does not take over product persistence, routing, document
metadata, or favicons.

Verify there is no theme flash, hydration mismatch, or duplicate React runtime.

## 3. Replace tokens

Map local semantic roles to PADS tokens before replacing many components. Remove
raw values only after all references have moved. If a local token expresses real
product meaning, keep it as a product alias to a PADS semantic token rather than
adding product business terminology to PADS.

Do not alias two competing token systems indefinitely. Give temporary aliases an
owner and removal issue.

## 4. Replace primitives

Start with low-risk components such as Button, Badge, Field, Input, Spinner, and
Tooltip. Replace direct Ant imports with PADS public exports. Exercise form
semantics, focus, validation, and disabled behavior before moving on.

Avoid a broad mechanical rename when local props differ. Use a short-lived local
adapter where it makes the migration reviewable:

```tsx
// Temporary product adapter; remove after callers use the PADS API.
export function LegacyPrimaryButton(props: LegacyButtonProps) {
  return <Button variant="primary" {...translateLegacyProps(props)} />;
}
```

The adapter must not be published by PADS.

## 5. Replace composites and patterns

Migrate empty/error/loading states, page headers, cards, settings patterns,
search surfaces, overlays, composer, media, charts, and rich content in coherent
workflow slices. Keep network requests and route decisions outside the shared
component.

Install optional chart or rich-content packages only in products that use them.

## 6. Adopt layouts and templates

Adopt WorkspaceShell, dashboard, settings, conversation, editor, reader, or
media templates only after primitives and tokens are stable. Provide navigation,
user controls, content, and callbacks through slots. Do not move a router,
authentication state, query client, or product registry into PADS.

## 7. Remove the legacy boundary

After all callers move:

- remove product-local duplicate components and styles;
- remove direct Ant dependencies if no product-owned use remains;
- remove temporary aliases and adapters;
- make architecture lint reject new direct imports and raw values;
- update product engineering documentation to name PADS as the UI boundary.

## Verification checklist

- Critical workflows behave identically or have an approved, documented change.
- Light and dark modes use the intended product brand recipe.
- Keyboard order, focus, overlays, validation, and announcements are correct.
- Loading, empty, zero, error, offline, disabled, and destructive paths work.
- 320px, tablet, desktop, and 200% zoom layouts remain usable.
- No product data, route, or transport type entered a PADS package.
- No source, local path, symlink, or sibling repository import remains.
- Product tests, visual baselines, builds, bundle checks, and full verification
  pass.

## Version coordination

Pin a released PADS version in each product and upgrade through normal dependency
pull requests. Read Changesets and release notes before upgrading. Major upgrades
use a product migration plan and may be rolled out one product at a time.

Do not point production products at a branch, commit archive, or local checkout.
