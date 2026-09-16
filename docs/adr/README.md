# Architecture decision records

Architecture decision records (ADRs) capture decisions with cross-package,
long-term, or difficult-to-reverse consequences.

## Process

1. Copy `0000-template.md` to the next available four-digit number.
2. Use a short noun phrase for the filename and title.
3. Begin with `Proposed`; merge as `Accepted` only after approval.
4. Record alternatives and consequences, including accessibility, compatibility,
   security, bundle, and migration impact.
5. Link implementation pull requests and follow-up work.
6. Supersede an old ADR with a new one; do not rewrite accepted history.

## Status values

- `Proposed`
- `Accepted`
- `Deprecated`
- `Superseded by ADR-NNNN`
- `Rejected`

Accepted decisions:

- [ADR-0001: Publish PADS as bounded packages](0001-package-boundaries.md)
- [ADR-0002: Generate platform artifacts from DTCG-compatible tokens](0002-token-source-of-truth.md)
- [ADR-0003: Keep Ant Design behind an internal adapter](0003-ant-adapter.md)
- [ADR-0004: Validate offline packed-consumer peers explicitly](0004-offline-packed-consumer-peer-validation.md)

- [ADR-0005: Publish the PADS showcase with Storybook on GitHub Pages](0005-github-pages-showcase.md)
