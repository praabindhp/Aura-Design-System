# @praabindh/aura-testing

Consumer test helpers for rendering components inside a scoped Aura provider,
controlling media queries deterministically, and running axe-core audits.

```tsx
import {
  expectNoAccessibilityViolations,
  installMatchMedia,
  renderWithAura,
} from "@praabindh/aura-testing";

const media = installMatchMedia({ "(prefers-color-scheme: dark)": false });
const { container } = renderWithAura(<Example />);

media.setMatches("(prefers-color-scheme: dark)", true);
await expectNoAccessibilityViolations(container);
media.restore();
```

`installMatchMedia` supports modern `change` event listeners, legacy
`addListener` callbacks, `onchange`, abort signals, and one-shot listeners. Call
`restore` during test cleanup to reinstate the environment's original
`matchMedia` implementation.
