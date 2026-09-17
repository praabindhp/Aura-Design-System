import {
  Alert,
  Button,
  Confirm,
  Dialog,
  Drawer,
  EmptyState,
  ErrorState,
  Heading,
  IconButton,
  Loader,
  LoadingState,
  Stack,
  Tooltip,
  useAuraFeedback,
} from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Inbox, Trash2 } from "lucide-react";
import { useState } from "react";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Feedback/States and overlays",
  parameters: {
    docs: {
      description: {
        component:
          "Feedback pairs color with text and semantics. Overlays preserve focus, keyboard dismissal, and provider context.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function ToastAction() {
  const feedback = useAuraFeedback();
  return (
    <Button onClick={() => feedback.success("Workspace saved")}>
      Show success message
    </Button>
  );
}

export const StateMatrix: Story = {
  render: function Render() {
    const [infoVisible, setInfoVisible] = useState(true);
    return (
      <StoryPage>
        <StoryIntro
          eyebrow="Feedback · System status"
          title="Status that stays clear without color"
          description="Alerts and full states explain what happened, what it means, and what a person can do next."
        />
        <Stack gap={4}>
          {infoVisible ? (
            <Alert
              title="New design-system version available"
              description="Review the migration notes before upgrading a product."
              onDismiss={() => setInfoVisible(false)}
            />
          ) : null}
          <Alert
            tone="success"
            title="All package checks passed"
            description="Declarations, exports, styles, and consumer builds are valid."
          />
          <Alert
            tone="warning"
            title="Contrast review required"
            description="A changed brand pair is waiting for accessibility evidence."
          />
          <Alert
            tone="danger"
            title="Release blocked"
            description="The packed consumer could not resolve the stylesheet export."
          />
          <div className="docsGrid">
            <EmptyState
              icon={<Inbox size={22} />}
              title="No components match"
              description="Try a broader category or clear the search filter."
              action={<Button variant="secondary">Clear filters</Button>}
            />
            <ErrorState
              title="Storybook could not load"
              description="Check the local build and try again."
              onRetry={() => undefined}
            />
            <div className="docsDemoPanel">
              <LoadingState label="Loading component metadata" />
            </div>
          </div>
        </Stack>
      </StoryPage>
    );
  },
};

export const PremiumLoader: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Feedback · Loading"
        title="A calm signal while work takes shape"
        description="Loader gives route and content boundaries a branded progress treatment, while preserving visible status text and reduced-motion support."
      />
      <div className="docsGrid">
        <div className="docsDemoPanel">
          <Loader label="Preparing components" size="sm" />
        </div>
        <div className="docsDemoPanel">
          <Loader
            label="Opening your workspace"
            description="Bringing the latest details into focus."
            size="lg"
          />
        </div>
      </div>
    </StoryPage>
  ),
};

export const OverlayControls: Story = {
  render: function Render() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
      <StoryPage>
        <StoryIntro
          eyebrow="Feedback · Overlays"
          title="Contextual layers with predictable focus"
          description="Use a dialog for focused decisions, a drawer for supporting tasks, confirmation for consequential actions, and tooltips for short labels."
        />
        <div className="docsRow">
          <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            Open drawer
          </Button>
          <Confirm
            tone="danger"
            title="Delete this draft?"
            description="This action cannot be undone."
            confirmLabel="Delete draft"
            onConfirm={() => undefined}
          >
            <Button variant="danger" startIcon={<Trash2 aria-hidden size={16} />}>
              Delete
            </Button>
          </Confirm>
          <Tooltip content="Notifications">
            <IconButton label="Notifications">
              <Bell aria-hidden size={18} />
            </IconButton>
          </Tooltip>
          <ToastAction />
        </div>
        <Dialog
          open={dialogOpen}
          title="Create a shared component"
          description="Define the semantic contract before implementation."
          footer={
            <div className="docsRow">
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Continue</Button>
            </div>
          }
          onClose={() => setDialogOpen(false)}
        >
          <Heading level={3} size="sm">
            Evidence required
          </Heading>
          <p>Include at least two reusable product contexts.</p>
        </Dialog>
        <Drawer
          open={drawerOpen}
          title="Review checklist"
          onClose={() => setDrawerOpen(false)}
        >
          <Stack gap={3}>
            <p>Light and dark themes</p>
            <p>Keyboard and screen reader</p>
            <p>Narrow containers and 200% zoom</p>
          </Stack>
        </Drawer>
      </StoryPage>
    );
  },
};
