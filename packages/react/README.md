# @praabindh/aura-design-system

The React implementation of Praabindh's Aura Design System. Import the global
foundation once, then wrap the application with `AuraProvider`.

```tsx
import "@praabindh/aura-design-system/styles.css";
import { AuraProvider, Button } from "@praabindh/aura-design-system";

<AuraProvider brand="verbaura" defaultTheme="system">
  <Button>Start writing</Button>
</AuraProvider>;
```

Ant Design is an internal implementation detail. Consumer code must use the owned
PADS contracts exported by this package.

Use `DropdownSelect` for a styled, accessible single-choice popup and `Select`
for native browser selection. See the [DropdownSelect guide](../../docs/dropdown-select.md)
for props, keyboard behavior, validation, and examples.
