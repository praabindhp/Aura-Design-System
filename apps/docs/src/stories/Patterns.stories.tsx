import {
  ActionCard,
  Badge,
  Button,
  CardGrid,
  CommandPalette,
  ComposerDock,
  ContextAction,
  ContextPalette,
  IconButton,
  MediaCard,
  MediaGrid,
  MediaPreview,
  MetricCard,
  PageHeader,
  ReferenceCard,
  Section,
  SettingsGroup,
  SettingsLayout,
  SettingsPanel,
  SettingsRow,
  Stack,
  StatusBadge,
  Surface,
  Switch,
  Text,
  Textarea,
  useAura,
} from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowUp,
  BarChart3,
  Brain,
  CheckCircle2,
  FileText,
  Image,
  MessageSquare,
  Palette,
  Search,
  Settings,
  Sparkles,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Patterns/Product workflows",
  parameters: {
    docs: {
      description: {
        component:
          "Patterns combine primitives around a recurring interaction while leaving routing, data, authorization, and persistence with the product.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const DashboardCards: Story = {
  render: () => (
    <StoryPage>
      <PageHeader
        eyebrow="Shared dashboard pattern"
        title="Good afternoon, Praabindh"
        description="A clear view of your Aura workspace."
        actions={<Button startIcon={<Sparkles aria-hidden size={16} />}>Create</Button>}
      />
      <Stack gap={5}>
        <Section
          title="Workspace assistant"
          description="Move from an idea to useful work."
        >
          <CardGrid columns={2}>
            <ActionCard
              icon={Brain}
              title="AI playground"
              description="Explore questions, sources, and reusable outputs."
              onClick={() => undefined}
            />
            <ActionCard
              icon={FileText}
              title="Projects and context"
              description="Bring trusted source files into focused work."
              onClick={() => undefined}
            />
          </CardGrid>
        </Section>
        <CardGrid columns={4}>
          <MetricCard
            icon={MessageSquare}
            label="Conversations"
            value="12"
            hint="Saved in your workspace"
            hintTone="success"
          />
          <MetricCard
            icon={FileText}
            label="Documents"
            value="28"
            hint="Across completed work"
            hintTone="success"
          />
          <MetricCard
            icon={Search}
            label="Searches"
            value="7"
            hint="Source-backed sessions"
            hintTone="success"
          />
          <MetricCard
            icon={BarChart3}
            label="Analyses"
            value="4"
            hint="Structured results"
            hintTone="success"
          />
        </CardGrid>
      </Stack>
    </StoryPage>
  ),
};

export const SettingsWorkspace: Story = {
  render: function Render() {
    const [section, setSection] = useState("appearance");
    const [compact, setCompact] = useState(false);
    return (
      <StoryPage>
        <StoryIntro
          eyebrow="Patterns · Settings"
          title="Predictable preference architecture"
          description="Navigation, panels, groups, and rows adapt to available space while consumers retain state ownership."
        />
        <SettingsLayout
          items={[
            { icon: User, label: "Profile", value: "profile" },
            { icon: Palette, label: "Appearance", value: "appearance" },
            { icon: Settings, label: "Preferences", value: "preferences" },
          ]}
          value={section}
          onValueChange={setSection}
        >
          <SettingsPanel
            title="Appearance"
            description="Choose how dense information feels in this workspace."
          >
            <SettingsGroup
              title="Interface"
              description="Applies to this product only."
            >
              <SettingsRow
                label="Compact density"
                description="Show more information without reducing text size."
                action={
                  <Switch
                    checked={compact}
                    label="Compact density"
                    onCheckedChange={setCompact}
                  />
                }
              />
            </SettingsGroup>
          </SettingsPanel>
        </SettingsLayout>
      </StoryPage>
    );
  },
};

function ComposerExample() {
  const { brand } = useAura();
  const [text, setText] = useState("");
  return (
    <ComposerDock
      brand={brand}
      collapsedLabel="Open Aura composer"
      label="Aura message"
      name="Aura"
      editor={
        <Textarea
          aria-label="Message"
          placeholder="Ask, analyze, or create…"
          rows={3}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      }
      controls={<Badge tone="neutral">Balanced</Badge>}
      action={
        <IconButton label="Send message" type="submit" variant="primary">
          <ArrowUp aria-hidden size={18} />
        </IconButton>
      }
      onSubmit={(event) => {
        event.preventDefault();
        setText("");
      }}
    />
  );
}

export const ComposerAndPalette: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Patterns · Conversation"
        title="A compact path from thought to action"
        description="The composer expands on intent, moves focus to the editor, closes with Escape, and preserves a clear submit action."
      />
      <Stack gap={6}>
        <ContextPalette
          label="Available tools"
          items={[
            {
              id: "write",
              icon: FileText,
              label: "Draft content",
              description: "Create a structured first version",
              category: "Writing",
            },
            {
              id: "research",
              icon: Search,
              label: "Research sources",
              description: "Find and compare trusted material",
              category: "Research",
            },
            {
              id: "image",
              icon: Image,
              label: "Create visual",
              description: "Generate a product-ready image",
              category: "Media",
            },
          ]}
          onSelect={() => undefined}
        />
        <div className="docsDemoPanel">
          <ComposerExample />
        </div>
      </Stack>
    </StoryPage>
  ),
};

export const MediaLibrary: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Patterns · Media"
        title="Visual assets with useful context"
        description="Media patterns keep preview, title, provenance, metadata, and actions understandable at every container size."
      />
      <Stack gap={5}>
        <MediaGrid label="Recent visual assets">
          {["Editorial concept", "Campaign study", "Product texture"].map((title) => (
            <MediaCard
              key={title}
              title={title}
              description="Generated from a fictional design brief."
              metadata={<Badge tone="success">Ready</Badge>}
              preview={
                <MediaPreview alt="" fallback={<Image aria-hidden size={28} />} />
              }
              onSelect={() => undefined}
            />
          ))}
        </MediaGrid>
        <Section
          title="References"
          description="Source context remains visible and removable."
        >
          <ReferenceCard
            title="Layout reference"
            description="Uploaded source · 2.1 MB"
            preview={<Image aria-hidden size={22} />}
            action={
              <IconButton label="Remove layout reference" variant="ghost">
                <Upload aria-hidden size={16} />
              </IconButton>
            }
          />
        </Section>
      </Stack>
    </StoryPage>
  ),
};

export const CommandAndStatusUtilities: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState("No command selected");
    const items = [
      {
        id: "new-project",
        icon: Sparkles,
        label: "Create project",
        description: "Start from a shared Aura template",
        category: "Create",
      },
      {
        id: "search-library",
        icon: Search,
        label: "Search library",
        description: "Find reusable product evidence",
        category: "Navigate",
      },
    ] as const;

    return (
      <StoryPage>
        <StoryIntro
          eyebrow="Patterns · Commands and status"
          title="Fast actions with explicit outcomes"
          description="StatusBadge names state in text. CommandPalette provides a searchable keyboard surface, and ContextAction marks a contextual destination without duplicating its accessible name."
        />
        <Surface elevation="raised" padding="lg">
          <Stack gap={4}>
            <StatusBadge icon={CheckCircle2} tone="success">
              Ready for release
            </StatusBadge>
            <Button
              endIcon={<ContextAction label="Opens command palette" />}
              onClick={() => setOpen(true)}
            >
              Open command palette
            </Button>
            <Text aria-live="polite" size="sm" tone="secondary">
              {selection}
            </Text>
          </Stack>
        </Surface>
        <CommandPalette
          items={items}
          open={open}
          title="Workspace commands"
          onClose={() => setOpen(false)}
          onSelect={(item) => setSelection(`${item.label} selected`)}
        />
      </StoryPage>
    );
  },
};
