import {
  AuraProvider,
  AuraThemeScript,
  Code,
  Divider,
  Heading,
  Kbd,
  Stack,
  Surface,
  Text,
  ThemeToggle,
} from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Foundations/Typography and space",
};

export default meta;
type Story = StoryObj;

export const TypeHierarchy: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Foundations · Typography"
        title="Readable hierarchy without visual noise"
        description="Lexend supports the interface voice. Semantic sizes preserve rhythm across dashboards, editors, settings, and dense tools."
      />
      <Surface elevation="raised" padding="lg">
        <Stack gap={5}>
          <div>
            <Heading level={2} size="lg">
              Display heading
            </Heading>
            <Text tone="muted">High-level greetings and rare hero moments</Text>
          </div>
          <Divider />
          <div>
            <Heading level={3}>Section heading</Heading>
            <Text tone="secondary">
              Default body copy explains the next action in direct, useful language.
            </Text>
          </div>
          <div className="docsRow">
            <Text size="sm" tone="muted">
              Supporting metadata
            </Text>
            <Code>npm run verify</Code>
            <Kbd>⌘ K</Kbd>
          </div>
        </Stack>
      </Surface>
    </StoryPage>
  ),
};

export const SpacingScale: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Foundations · Space"
        title="A deliberate four-pixel rhythm"
        description="Shared space tokens create consistent density while component composition owns the relationship between elements."
      />
      <Surface elevation="raised" padding="lg">
        <div className="docsScale">
          {[1, 2, 3, 4].map((size) => (
            <div className="docsScaleItem" key={size}>
              <Code>space.{size * 4}</Code>
              <span
                aria-label={`${size * 16} pixel example`}
                className="docsScaleBar"
                data-size={size}
              />
            </div>
          ))}
        </div>
      </Surface>
    </StoryPage>
  ),
};

export const ThemeRuntime: Story = {
  render: () => (
    <StoryPage>
      <AuraThemeScript
        brand="aura"
        defaultTheme="light"
        nonce="storybook-csp-nonce"
        storageKey={null}
      />
      <StoryIntro
        eyebrow="Foundations · Theme runtime"
        title="A stable first paint and an explicit theme control"
        description="AuraThemeScript resolves the theme before hydration, while ThemeToggle exposes the same provider-owned preference through an accessible control."
      />
      <AuraProvider applyTo="scope" brand="aura" defaultTheme="light" storageKey={null}>
        <Surface elevation="raised" padding="lg">
          <Stack gap={4}>
            <div className="docsRow">
              <ThemeToggle />
              <Text as="span" tone="secondary">
                Toggle this independently themed surface
              </Text>
            </div>
            <Text size="sm" tone="muted">
              Applications place the nonce-aware script in the document head and keep
              product code free of duplicated theme persistence logic.
            </Text>
          </Stack>
        </Surface>
      </AuraProvider>
    </StoryPage>
  ),
};
