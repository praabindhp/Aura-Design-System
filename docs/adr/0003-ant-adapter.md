# ADR-0003: Keep Ant Design behind an internal adapter

- Status: Accepted
- Date: 2026-09-04
- Owner: Praabindh
- Review or removal date: Not applicable

## Context

Aura products use Ant Design successfully for many control mechanics, but direct
re-exports, public Ant prop types, and page-level overrides would make Ant's API
and class structure the PADS contract. That would limit consistent defaults and
make an implementation upgrade a product-wide migration.

## Decision

Ant Design remains an implementation dependency of
`@praabindh/aura-design-system`. All Ant imports live in an internal adapter.
PADS exposes owned component names, props, event contracts, tokens, styles, and
types. Consumers do not import Ant to use or customize a PADS component.

Static overlay APIs that bypass provider context are not exposed. Theme-aware
overlays use the PADS provider and restore focus according to the documented
component contract.

## Alternatives considered

### Re-export Ant components directly

This is fast but leaks a large third-party API, styling semantics, and breaking
change surface.

### Reimplement every primitive immediately

This removes the dependency but creates substantial accessibility and behavior
risk without improving the user-facing contract.

### Allow product-level Ant overrides

This recreates visual drift and prevents PADS from owning states across themes.

## Consequences

PADS maintains translation wrappers and must test behavior independently of Ant
implementation details. Consumers receive a smaller, stable semantic API and can
migrate through PADS versions rather than Ant versions.

## Verification

- Architecture lint allows Ant imports only in the internal adapter.
- Declaration, Publint, and Are the Types Wrong checks reject leaked public Ant
  types or invalid export contracts.
- Tests query semantic roles and behavior rather than Ant classes.
- Product migration guidance removes direct imports and `.ant-*` overrides.
