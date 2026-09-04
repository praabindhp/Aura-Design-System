# ADR 0004: Offline packed-consumer peer validation

- **Status:** Accepted
- **Date:** 2026-09-04
- **Owner:** Praabindh
- **Review by:** 2027-03-04

## Context

The release gate installs freshly packed PADS tarballs into a temporary Vite
consumer without registry access. External dependencies are exact versions from
the repository's clean lockfile install and are exposed to that temporary
consumer as directory links. npm cannot infer package versions from those
pre-seeded links during its peer-resolution phase, even though their manifests
are available and the consumer build resolves them correctly.

## Decision

The isolated installation uses `--legacy-peer-deps` only to bypass npm's
versionless-link resolution failure. Before npm runs, the gate independently:

- collects every required peer declared by a packed PADS package;
- resolves the peer to an exact lockfile-installed package or another packed
  PADS package;
- validates the installed version against the declared peer range; and
- fails on a missing, unsupported, or incompatible peer contract.

The gate then verifies that every PADS package is a real directory installed
from its tarball, checks its exact identity and version, and runs consumer
typechecking and a production build without workspace paths. The flag is not
used in repository installation, CI setup, product consumption, or publishing.

## Consequences

The release test remains offline and reproducible on developer and CI machines
without copying a global npm cache or weakening the public peer contract. The
small range evaluator intentionally rejects syntax it does not understand, so a
new peer-range form must be supported explicitly rather than silently accepted.

The tradeoff is a narrowly scoped npm compatibility flag in test tooling. Remove
it when npm can validate the pre-seeded directory-link versions, or replace the
link strategy with a cross-platform offline cache that is proven on all
supported environments. Re-evaluate no later than the review date above.
