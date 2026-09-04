## Outcome

Describe the consumer-visible result and the owning package or documentation
area. Link the issue, proposal, or ADR.

## Compatibility and risk

- SemVer impact: patch / minor / major / none
- Public exports or token contracts changed:
- Product migration required:
- Accessibility, browser, bundle, SSR, security, and privacy risks:

## Evidence

List tests and stories. For visible changes, include light and dark screenshots,
affected brands, responsive widths, focus/keyboard behavior, and 200% zoom.

## Checklist

- [ ] I read `AGENTS.md` and the relevant architecture and component standards.
- [ ] The change stays within the correct package boundary and contains no
      product routes, stores, services, or transport contracts.
- [ ] Public APIs use PADS-owned types and do not expose Ant Design internals.
- [ ] Raw values were changed only in token sources; generated artifacts were
      rebuilt rather than hand-edited.
- [ ] Meaningful default, hover, focus, active, selected, loading, empty, error,
      disabled, read-only, and destructive states were reviewed.
- [ ] Light, dark, system, affected brands, reduced motion, and forced colors
      were reviewed as applicable.
- [ ] Keyboard operation, focus restoration, accessible names, announcements,
      contrast, touch targets, reflow, and 200% zoom were exercised.
- [ ] Narrow, medium, and wide containers were reviewed without product-specific
      breakpoints.
- [ ] Tests and Storybook stories prove the changed contract.
- [ ] Declaration/export contracts, package exports, packed-consumer behavior,
      and bundle budgets were updated when affected.
- [ ] A Changeset describes every consumer-visible change, or the PR explains
      why none is required.
- [ ] Documentation and migration guidance were updated with the implementation.
- [ ] `npm run verify` passes from a clean root install.
- [ ] Any exception has a time-bounded ADR with an owner and removal condition.
- [ ] The change contains no credentials, production data, private assets, or
      local/sibling repository dependency.
