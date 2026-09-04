import { Surface } from "@praabindh/aura-design-system";
import { RichMarkdown } from "@praabindh/aura-rich-content";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Optional packages/Rich content",
  parameters: {
    docs: {
      description: {
        component:
          "Safe Markdown, code, tables, and long-form prose remain an optional dependency. Raw HTML and unsafe URLs do not render.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const article = `# Quantum computing, clearly explained

A quantum computer uses the rules of quantum physics to process particular
classes of information differently from ordinary computers.

## A concise mental model

> Superposition, entanglement, and interference reshape probabilities so useful
> answers become more likely when measured.

| Concept | Practical meaning |
| --- | --- |
| Superposition | A state can represent a combination of possibilities. |
| Entanglement | Qubits can share correlations across a system. |
| Interference | Algorithms amplify useful outcomes and suppress others. |

\`\`\`tsx
<AuraProvider brand="cognaura" theme="dark">
  <Reader />
</AuraProvider>
\`\`\`

[Read the security guidance](https://example.com/security).

[Unsafe link](javascript:alert('blocked')).

<script>alert('raw HTML is skipped')</script>`;

export const LongFormReader: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Optional package · Rich content"
        title="Comfortable long-form reading"
        description="Prose retains clear hierarchy, horizontal table containment, code affordances, safe links, and predictable copy feedback."
      />
      <Surface elevation="raised" padding="lg">
        <RichMarkdown copyCode={() => Promise.resolve()}>{article}</RichMarkdown>
      </Surface>
    </StoryPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
    await expect(canvas.getByRole("button", { name: "Copied" })).toBeVisible();
  },
};

export const ImagePrivacyDefault: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Optional package · Privacy"
        title="Remote images are opt-in"
        description="Unapproved image requests are omitted by default so rich content cannot silently introduce a tracking request."
      />
      <Surface elevation="raised" padding="lg">
        <RichMarkdown>
          {"![A remote analytics diagram](https://example.com/tracker.png)"}
        </RichMarkdown>
      </Surface>
    </StoryPage>
  ),
};
