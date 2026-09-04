# Source provenance and extraction policy

PADS was established from reusable implementation patterns already built for
VerbAura, CognAura, RendAura, and CharterAura. The applications are evidence and
design inputs; they are not runtime or build dependencies.

## Source of truth during extraction

Actual component, token, layout, test, and theme code is the primary source for
behavioral analysis. Product screenshots provide visual context and regression
evidence only. A screenshot does not define semantics, keyboard behavior,
responsive rules, loading/error states, or a public component API.

Extraction reviews consider:

- existing component behavior and tests;
- token values and light/dark mappings;
- layout and responsive styles;
- product usage across real workflows;
- accessibility semantics and focus behavior;
- duplicated or conflicting implementations;
- third-party boundaries and bundle cost.

## Extract, reconcile, do not copy blindly

When products implement the same concept differently:

1. identify the shared user and interaction contract;
2. preserve the strongest accessible behavior;
3. remove product routes, stores, DTOs, services, copy, and permissions;
4. translate visual constants to semantic tokens;
5. define a small PADS-owned public API;
6. add independent tests and stories;
7. verify the packed package in a clean consumer.

Existing defects, one-off overrides, raw values, and legacy global CSS are not
carried forward merely because they exist in a product. Fix the shared contract
inside PADS and plan product adoption separately.

## Independence

This repository must clone, install, build, test, document, and publish without
access to a sibling checkout. Therefore it contains no:

- local-path package dependency;
- symlink to product code;
- Git submodule for an Aura application;
- import from a product source tree;
- generated file that reads a sibling repository;
- requirement for a product credential, database, or service.

Examples and fixtures use fictional, repository-owned data.

## Product adoption

Products adopt released PADS packages through the incremental process in
[migration.md](migration.md). Establishing this repository does not modify or
authorize modification of a product. Product teams retain control of migration
timing and verify each workflow against their own acceptance criteria.

## Third-party code and assets

Dependencies retain their own licenses and notices. Do not copy unlicensed
third-party component source, screenshots, fonts, icons, or brand assets into
PADS. New assets must have clear ownership and redistribution terms. Security or
license uncertainty blocks publication until resolved.
