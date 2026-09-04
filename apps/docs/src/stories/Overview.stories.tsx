import {
  Badge,
  Button,
  CardGrid,
  Heading,
  ProductMark,
  Stack,
  Surface,
  Text,
  type AuraBrand,
} from "@praabindh/aura-design-system";
import { auraBrands } from "@praabindh/aura-tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Introduction/Welcome",
  parameters: {
    docs: {
      description: {
        component:
          "The living implementation contract for Praabindh's Aura-Design-System under PRAABINDH CORP.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const brandNames: Readonly<Record<AuraBrand, string>> = {
  aura: "Aura",
  verbaura: "VerbAura",
  cognaura: "CognAura",
  rendaura: "RendAura",
  charteraura: "CharterAura",
  "charteraura-intermediate": "CharterAura Intermediate",
};

export const DesignSystem: Story = {
  name: "Design system",
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="PRAABINDH CORP"
        title="One polished language for every Aura product"
        description="PADS combines shared tokens, accessible React behavior, responsive product patterns, and rigorous package contracts without importing product business logic."
      />
      <Stack gap={6}>
        <div className="docsRow">
          <Badge tone="success" icon={<CheckCircle2 aria-hidden size={14} />}>
            WCAG 2.2 AA
          </Badge>
          <Badge tone="brand">React 19</Badge>
          <Badge tone="info">DTCG tokens</Badge>
          <Badge tone="neutral">Private packages</Badge>
        </div>
        <CardGrid columns={3}>
          {auraBrands.map((brand) => (
            <Surface elevation="raised" key={brand} padding="lg">
              <Stack gap={3}>
                <ProductMark brand={brand} size="lg" />
                <Heading level={2} size="sm">
                  {brandNames[brand]}
                </Heading>
                <Text tone="secondary">
                  A contrast-checked brand recipe across light and dark themes.
                </Text>
              </Stack>
            </Surface>
          ))}
        </CardGrid>
        <Surface elevation="raised" padding="lg">
          <Stack gap={3}>
            <Heading level={2}>Use semantic contracts</Heading>
            <Text tone="secondary">
              Products import components and meaning. PADS owns visual values,
              interaction mechanics, accessibility defaults, and responsive behavior.
            </Text>
            <div>
              <Button endIcon={<ArrowRight aria-hidden size={16} />}>
                Explore components
              </Button>
            </div>
          </Stack>
        </Surface>
      </Stack>
    </StoryPage>
  ),
};
