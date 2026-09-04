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
