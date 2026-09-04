# Governance

## Stewardship

Praabindh's Aura Design System (PADS) is authored and stewarded by Praabindh as
a PRAABINDH CORP project. The repository owner is accountable for design-system
direction, public API stability, accessibility standards, releases, and security
response.

Governance exists to make decisions reviewable and predictable, not to replace
product discovery or design critique.

## Decision classes

### Routine changes

Compatible fixes, test improvements, documentation corrections, and additions
that follow an accepted component contract use normal pull-request review.

### Design-system proposals

New public components, variants, semantic tokens, or broad visual changes need a
proposal that covers:

- user problem and evidence from product contexts;
- why composition of existing parts is insufficient;
- proposed API and semantics;
- accessibility and content behavior;
- responsive behavior and states;
- package, bundle, migration, and maintenance impact;
- alternatives considered.

The maintainer may accept, request an experiment, narrow the scope, or keep the
solution product-owned until reuse is demonstrated.

### Architecture decisions

An ADR is required for:

- new package or dependency direction;
- changes to token layers or generation;
- public API conventions;
- global styling or provider behavior;
- minimum runtime/browser changes;
- quality-rule exceptions;
- breaking migrations with cross-product consequences.

ADRs document a decision and its tradeoffs. They do not replace component
documentation or a Changeset.

## Stability levels

### Stable

Stable APIs follow SemVer, meet all release gates, and appear in normal public
exports. Breaking changes require a major release.

### Beta

Beta APIs are usable for product validation but may change in a minor release.
They are visibly labelled, exported from a beta entry point, and include an
owner and graduation criteria. A product must opt in deliberately.

### Internal

Internal adapters and helpers are not exported and receive no compatibility
guarantee. Source-path imports are forbidden.

There is no permanent experimental dumping ground. A beta capability graduates,
is redesigned, or is removed by its review date.

## Component lifecycle

1. **Proposal**: define the shared problem and contract.
2. **Beta**: validate behavior in realistic stories and willing product
   consumers.
3. **Stable**: complete documentation, accessibility, browser, package, and API
   gates.
4. **Deprecated**: document the replacement and automated or manual migration.
5. **Removed**: remove only in an announced major release.

Deprecation normally lasts at least two minor releases and 90 days, unless a
security issue makes continued support unsafe. Security-driven removals still
include the safest available mitigation.

## Ownership and review

`CODEOWNERS` requests the repository owner's review. Changes to public exports,
token sources, accessibility behavior, release configuration, or architecture
need explicit owner approval.

Authors remain responsible for updating the change after review and for
following up on accepted limitations. An ADR exception identifies one named
owner and a removal condition.

## Release governance

- Every consumer-visible change includes a Changeset.
- Declaration/export contract results and visual baselines are reviewed
  artifacts.
- A release occurs from protected `main` after the full quality gate.
- Published artifacts are produced in CI, not from a developer workstation.
- Publication uses protected CI and least-privilege access to the restricted
  PRAABINDH CORP registry scope.
- Yank or deprecate a bad release; never replace an existing npm version.

See [releasing.md](releasing.md).

## Conflict and appeal

Design feedback should cite user needs, PADS principles, evidence, and tradeoffs.
The repository owner makes the final decision when consensus is not reached and
records consequential decisions in an ADR. Anyone may request reconsideration
with new evidence.

Conduct concerns follow [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md). Security
concerns follow [SECURITY.md](../SECURITY.md).
