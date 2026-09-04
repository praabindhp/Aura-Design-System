# ADR-0002: Generate platform artifacts from DTCG-compatible tokens

- Status: Accepted
- Date: 2026-09-04
- Owner: Praabindh
- Review or removal date: Not applicable

## Context

Existing products express related visual decisions in TypeScript objects and CSS
custom properties. Maintaining CSS, TypeScript, JSON, and implementation-adapter
values separately would reproduce drift inside the new design system.

## Decision

Store reviewed reference, semantic, brand, and component tokens once in a
Design Tokens Community Group-compatible source format. Use the
repository-owned deterministic Node compiler to generate CSS, typed
JavaScript/TypeScript, JSON, and adapter artifacts. The compiler is intentionally
small, versioned with the schema it implements, and has no Style Dictionary
runtime.

Literal colors live only in approved reference and brand source files. Consumer
components use semantic or component aliases. Generated artifacts are never
hand-edited.

## Alternatives considered

### TypeScript objects only

This is convenient for React but less portable to design tooling, CSS-only
consumers, and future platforms.

### Hand-maintained CSS and TypeScript

This is easy initially but permits silent disagreement between outputs.

### Runtime token generation

This increases browser work and makes static validation, CSP behavior, and
non-JavaScript consumption harder.

## Consequences

The repository gains a build step and an owned compiler to maintain. In
exchange, token names and values are reproducible across platforms without
outsourcing PADS semantics to a general-purpose transformer. Compiler changes
require reviewed output and may affect published artifacts.

## Verification

- Schema, alias, cycle, type, and required-role tests.
- Contrast tests for required semantic pairs.
- Deterministic clean builds.
- Architecture and style lint reject raw values outside approved token source.
