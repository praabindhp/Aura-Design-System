import {
  Avatar,
  Badge,
  Button,
  Code,
  Heading,
  IconButton,
  Inline,
  LinkButton,
  ProductMark,
  Progress,
  Skeleton,
  Spinner,
  Stack,
  Surface,
  Text,
} from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Download, Plus, Settings, Sparkles } from "lucide-react";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Primitives/Actions and identity",
  parameters: {
    docs: {
      description: {
        component:
          "Small, composable controls with semantic variants, predictable focus, and native element contracts.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Primitives · Actions"
        title="Clear hierarchy for every action"
        description="Primary actions remain scarce. Secondary, ghost, and danger variants preserve meaning across all brand and theme combinations."
      />
      <div className="docsFlow">
        <section className="docsSection">
          <Heading level={2}>Button variants</Heading>
          <Inline>
            <Button startIcon={<Plus aria-hidden size={16} />}>Create project</Button>
            <Button variant="secondary" startIcon={<Download aria-hidden size={16} />}>
              Export
            </Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="danger">Delete</Button>
          </Inline>
        </section>
        <section className="docsSection">
          <Heading level={2}>Sizes and states</Heading>
          <Inline>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading>Saving</Button>
            <Button disabled>Unavailable</Button>
          </Inline>
        </section>
        <section className="docsSection">
          <Heading level={2}>Icon and link actions</Heading>
          <Inline>
            <IconButton label="Open settings">
              <Settings aria-hidden size={18} />
            </IconButton>
            <IconButton label="Generate" variant="primary">
              <Sparkles aria-hidden size={18} />
            </IconButton>
            <LinkButton
              href="#link-example"
              endIcon={<ArrowRight aria-hidden size={16} />}
            >
              View guidance
            </LinkButton>
          </Inline>
        </section>
      </div>
    </StoryPage>
  ),
};

export const IdentityAndStatus: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Primitives · Identity"
        title="Recognizable without overwhelming content"
        description="Product marks, avatars, status, progress, and loading primitives use consistent geometry and accessible names."
      />
      <div className="docsGrid">
        <Surface elevation="raised" padding="lg">
          <Stack gap={4}>
            <Heading level={2}>Identity</Heading>
            <Inline>
              <ProductMark brand="verbaura" />
              <ProductMark brand="cognaura" />
              <ProductMark brand="rendaura" />
              <ProductMark brand="charteraura" />
              <Avatar fallback="PP" alt="Praabindh profile" />
            </Inline>
          </Stack>
        </Surface>
        <Surface elevation="raised" padding="lg">
          <Stack gap={4}>
            <Heading level={2}>Status tones</Heading>
            <Inline>
              <Badge>Brand</Badge>
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="success">Ready</Badge>
              <Badge tone="warning">Review</Badge>
              <Badge tone="danger">Failed</Badge>
              <Badge tone="info">Running</Badge>
            </Inline>
          </Stack>
        </Surface>
        <Surface elevation="raised" padding="lg">
          <Stack gap={3}>
            <Heading level={2}>Progress</Heading>
            <Text tone="secondary">12,400 of 20,000 words used</Text>
            <Progress label="Monthly word usage: 62%" value={62} />
          </Stack>
        </Surface>
        <Surface elevation="raised" padding="lg">
          <Stack gap={3}>
            <Heading level={2}>Loading</Heading>
            <Inline>
              <Spinner label="Loading results" />
              <Code>aria-busy</Code>
            </Inline>
            <Skeleton label="Loading heading" />
            <Skeleton label="Loading content" size="lg" variant="block" />
          </Stack>
        </Surface>
      </div>
    </StoryPage>
  ),
};
