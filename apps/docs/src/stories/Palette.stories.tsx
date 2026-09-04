import { Code, Heading, Stack, Text } from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Foundations/Palette",
  parameters: {
    docs: {
      description: {
        component:
          "Semantic colors remain stable while the Storybook brand and theme toolbar resolves suitable values.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const swatches = [
  {
    className: "docsTokenBrandAction",
    label: "Primary action",
    token: "--aura-brand-action",
  },
  { className: "docsTokenBrandSoft", label: "Brand soft", token: "--aura-brand-soft" },
  { className: "docsTokenSurface", label: "Surface", token: "--aura-bg-surface" },
  { className: "docsTokenSubtle", label: "Subtle surface", token: "--aura-bg-subtle" },
  {
    className: "docsTokenSuccess",
    label: "Success",
    token: "--aura-status-success-bg",
  },
  {
    className: "docsTokenWarning",
    label: "Warning",
    token: "--aura-status-warning-bg",
  },
  { className: "docsTokenDanger", label: "Danger", token: "--aura-status-danger-bg" },
  { className: "docsTokenInfo", label: "Information", token: "--aura-status-info-bg" },
] as const;

export const SemanticColors: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Foundations · Color"
        title="Semantic color system"
        description="Use the toolbar to inspect every swatch in light, dark, and each Aura brand. Component code consumes role names, never raw color stops."
      />
      <div className="docsGridCompact">
        {swatches.map((swatch) => (
          <article className="docsSwatch" key={swatch.token}>
            <div className={`docsSwatchColor ${swatch.className}`} />
            <div className="docsSwatchBody">
              <Heading level={2} size="sm">
                {swatch.label}
              </Heading>
              <Text size="sm" tone="muted">
                <Code>{swatch.token}</Code>
              </Text>
            </div>
          </article>
        ))}
      </div>
    </StoryPage>
  ),
};

export const BrandDiscipline: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Foundations · Brand"
        title="Quiet, purposeful brand color"
        description="Brand emphasis belongs on primary actions, focus, identity, selection, and restrained data accents—not every surface."
      />
      <Stack gap={4}>
        <div className="docsDemoPanel docsTokenBrandSoft">
          <Heading level={2}>Soft emphasis</Heading>
          <Text tone="secondary">
            Low-chroma backgrounds preserve the polished product hierarchy.
          </Text>
        </div>
        <div className="docsDemoPanel">
          <Heading level={2}>Neutral working surface</Heading>
          <Text tone="secondary">
            Most product content remains neutral so actions and status stay meaningful.
          </Text>
        </div>
      </Stack>
    </StoryPage>
  ),
};
