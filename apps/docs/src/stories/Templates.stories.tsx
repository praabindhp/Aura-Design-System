import {
  AuthTemplate,
  Badge,
  Button,
  CardGrid,
  ConversationTemplate,
  DashboardTemplate,
  EditorTemplate,
  Field,
  Heading,
  Input,
  MediaPreview,
  MediaStudioTemplate,
  MetricCard,
  SettingsGroup,
  SettingsPanel,
  SettingsRow,
  SettingsTemplate,
  Stack,
  Surface,
  Switch,
  Text,
  Textarea,
  useAura,
} from "@praabindh/aura-design-system";
import { RichMarkdown } from "@praabindh/aura-rich-content";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BarChart3,
  FileText,
  Image,
  Palette,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

const meta: Meta = {
  title: "Templates/Product-neutral surfaces",
  parameters: {
    docs: {
      description: {
        component:
          "Templates demonstrate complete responsive structures. Consumers provide copy, data, callbacks, and route behavior through composition.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Authentication: Story = {
  parameters: { layout: "fullscreen" },
  render: function Render() {
    const { brand } = useAura();
    return (
      <AuthTemplate
        brand={brand}
        brandTitle="Your Aura workspace"
        brandDescription="One secure place for focused, accessible work."
        title="Welcome back"
        description="Sign in with your organization account."
        footer={<Text size="sm">A PRAABINDH CORP product</Text>}
      >
        <form className="docsForm" onSubmit={(event) => event.preventDefault()}>
          <Field htmlFor="auth-email" label="Email">
            <Input id="auth-email" autoComplete="email" type="email" />
          </Field>
          <Field htmlFor="auth-password" label="Password">
            <Input id="auth-password" autoComplete="current-password" type="password" />
          </Field>
          <Button fullWidth type="submit">
            Sign in
          </Button>
        </form>
      </AuthTemplate>
    );
  },
};

export const Dashboard: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <DashboardTemplate
      header={{
        eyebrow: "Workspace overview",
        title: "Good afternoon, Praabindh",
        description: "A clear view of completed work and remaining capacity.",
        actions: <Button>New project</Button>,
      }}
      aside={
        <Surface elevation="raised" padding="lg">
          <Stack gap={3}>
            <strong>Recent activity</strong>
            <Text tone="secondary">No urgent follow-up is required.</Text>
            <Badge tone="success">All systems ready</Badge>
          </Stack>
        </Surface>
      }
    >
      <CardGrid columns={2}>
        <MetricCard
          icon={FileText}
          label="Documents"
          value="28"
          hint="Saved in your workspace"
          hintTone="success"
        />
        <MetricCard
          icon={Search}
          label="Searches"
          value="12"
          hint="Source-backed sessions"
          hintTone="success"
        />
        <MetricCard
          icon={BarChart3}
          label="Analyses"
          value="7"
          hint="Completed this month"
          hintTone="success"
        />
      </CardGrid>
    </DashboardTemplate>
  ),
};

export const SettingsSurface: Story = {
  render: function Render() {
    const [section, setSection] = useState("appearance");
    const [motion, setMotion] = useState(false);
    return (
      <SettingsTemplate
        header={{
          eyebrow: "Account",
          title: "Settings",
          description: "Manage product-owned preferences through shared structure.",
        }}
        items={[
          { icon: User, label: "Profile", value: "profile" },
          { icon: Palette, label: "Appearance", value: "appearance" },
          { icon: Settings, label: "Advanced", value: "advanced" },
        ]}
        value={section}
        onValueChange={setSection}
      >
        <SettingsPanel
          title="Appearance"
          description="Honor system preferences by default."
        >
          <SettingsGroup title="Motion and density">
            <SettingsRow
              label="Reduce nonessential motion"
              description="The product persists this preference."
              action={
                <Switch
                  checked={motion}
                  label="Reduce motion"
                  onCheckedChange={setMotion}
                />
              }
            />
          </SettingsGroup>
        </SettingsPanel>
      </SettingsTemplate>
    );
  },
};

const exampleMarkdown = `## Clear, reusable output

The reader surface supports **structured prose**, lists, tables, and code without
moving product persistence into the design system.

> Product logic stays with the product. Shared behavior stays with PADS.

\`\`\`tsx
<AuraProvider brand="cognaura" theme="dark">
  <Application />
</AuraProvider>
\`\`\``;

export const EditorComparison: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <EditorTemplate
      toolbar={
        <div className="docsRow">
          <Badge tone="brand">Professional</Badge>
          <Badge tone="neutral">Balanced</Badge>
        </div>
      }
      primary={
        <div className="docsEditorPane">
          <Textarea
            aria-label="Original content"
            defaultValue="Draft shared design-system guidance here."
            rows={12}
          />
        </div>
      }
      secondary={
        <div className="docsEditorPane">
          <RichMarkdown>{exampleMarkdown}</RichMarkdown>
        </div>
      }
      footer={<Button>Apply rewrite</Button>}
    />
  ),
};

export const MediaStudio: Story = {
  render: () => (
    <MediaStudioTemplate
      controls={
        <Stack gap={4}>
          <Field htmlFor="media-prompt" label="Describe the visual">
            <Textarea
              id="media-prompt"
              placeholder="A polished product illustration…"
              rows={8}
            />
          </Field>
          <Button>Create visual</Button>
        </Stack>
      }
      preview={
        <MediaPreview
          alt="Generated preview placeholder"
          ratio="landscape"
          fallback={<Image aria-hidden size={32} />}
        />
      }
      references={
        <Surface elevation="raised" padding="md">
          <Text tone="secondary">
            References remain visible below the primary workspace.
          </Text>
        </Surface>
      }
    />
  ),
};

export const Conversation: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <ConversationTemplate
      body={
        <Stack gap={5}>
          <div>
            <Heading level={1} size="lg">
              Design-system review
            </Heading>
            <Text tone="secondary">
              A focused reading column keeps the conversation useful across viewport
              sizes.
            </Text>
          </div>
          <Surface elevation="raised" padding="lg">
            <Stack gap={3}>
              <Badge tone="brand">Aura assistant</Badge>
              <Text>
                The shared template owns the scrollable transcript and sticky composer
                regions. Products continue to own messages, persistence, and sending.
              </Text>
            </Stack>
          </Surface>
        </Stack>
      }
      composer={
        <form
          className="docsConversationComposer"
          onSubmit={(event) => event.preventDefault()}
        >
          <Textarea aria-label="Message" placeholder="Continue the review…" rows={2} />
          <Button type="submit">Send</Button>
        </form>
      }
    />
  ),
};
