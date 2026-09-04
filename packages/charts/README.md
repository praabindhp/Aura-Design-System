# @praabindh/aura-charts

Accessible, product-neutral charts for Praabindh's Aura Design System (PADS),
under PRAABINDH CORP.

## What this package guarantees

- Every visualization has a required accessible name and an equivalent data
  table for exact values.
- Series use labels and line patterns in addition to semantic color tones.
- Large datasets retain readable geometry inside keyboard-focusable scrolling
  regions.
- Invalid and negative values are normalized safely, and percentage charts are
  clamped to the inclusive 0–100 range.
- Styling consumes Aura semantic tokens and adapts to light, dark, and forced
  color themes without product-specific CSS.

## Usage

```tsx
import { ActivityChart } from "@praabindh/aura-charts";

<ActivityChart
  ariaLabel="Documents and searches completed this week"
  points={[
    { label: "Mon", values: { documents: 8, searches: 3 } },
    { label: "Tue", values: { documents: 12, searches: 5 } },
  ]}
  series={[
    { key: "documents", label: "Documents", tone: "brand" },
    { key: "searches", label: "Searches", tone: "info" },
  ]}
/>;
```

Load the Aura token theme once at the application root. Public chart APIs own
their data and tone types and do not expose Ant Design, Lucide, or product
contracts.
