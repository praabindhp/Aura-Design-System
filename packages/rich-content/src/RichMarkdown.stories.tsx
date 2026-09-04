import type { Meta, StoryObj } from "@storybook/react-vite";

import { RichMarkdown } from "./index.js";

const meta = {
  title: "Optional packages/Rich content",
  component: RichMarkdown,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof RichMarkdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Article: Story = {
  args: {
    children: `# Aura workspace

Rich content uses **semantic tokens** and safe, accessible defaults.

> One design language across every Aura product.

| Package | Purpose |
| --- | --- |
| \`@praabindh/aura-charts\` | Accessible visualizations |
| \`@praabindh/aura-rich-content\` | Trusted Markdown presentation |

\`\`\`tsx
import { RichMarkdown } from "@praabindh/aura-rich-content";

<RichMarkdown>{content}</RichMarkdown>;
\`\`\`

[Read the guidance](https://example.com/aura)
`,
  },
};

export const UntrustedContentDefaults: Story = {
  args: {
    children: `Images require explicit opt-in:

![Remote image](https://example.com/image.png)

Unsafe links are rendered as text: [unsafe](javascript:alert(1)).`,
  },
};
