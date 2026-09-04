import {
  AppShell,
  Badge,
  Box,
  Button,
  Container,
  DashboardLayout,
  Grid,
  Heading,
  PageHeader,
  PageLayout,
  ProductMark,
  SidebarLayout,
  SplitPane,
  Stack,
  Surface,
  Text,
  TopBar,
  UsageCard,
  VisuallyHidden,
  WorkspaceSurface,
  useAura,
} from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, FileText, Home, Search } from "lucide-react";
import { useState } from "react";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Layouts/Responsive workspaces",
  parameters: {
    docs: {
      description: {
        component:
          "Layout primitives own intrinsic geometry and reading order. Product navigation and content arrive through typed slots.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function ShellSidebar() {
  const { brand } = useAura();
  return (
    <SidebarLayout
      header={
        <div className="docsRow">
          <ProductMark brand={brand} />
          <div>
            <strong>Aura</strong>
            <Text size="sm" tone="muted">
              PRAABINDH CORP
            </Text>
          </div>
        </div>
      }
      navigation={
        <nav aria-label="Workspace sections" className="docsSidebarNav">
          <a aria-current="page" className="docsSidebarLink" href="#dashboard">
            Dashboard
          </a>
          <a className="docsSidebarLink" href="#projects">
            Projects
          </a>
          <a className="docsSidebarLink" href="#library">
            Library
          </a>
          <a className="docsSidebarLink" href="#settings">
            Settings
          </a>
        </nav>
      }
      footer={<UsageCard current={42} max={100} unit="outputs" />}
    />
  );
}

export const ApplicationShell: Story = {
  parameters: { layout: "fullscreen" },
  render: function Render() {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
      <AppShell
        header={
          <TopBar
            leading={<strong>Dashboard</strong>}
            center={<Badge tone="brand">Production-ready</Badge>}
            actions={<Button size="sm">New project</Button>}
          />
        }
        mobileNavigationLabel="Primary navigation"
        mobileNavigationOpen={mobileOpen}
        sidebar={<ShellSidebar />}
        onMobileNavigationChange={setMobileOpen}
      >
        <div className="docsShellContent">
          <PageHeader
            title="Responsive Aura workspace"
            description="Resize to see navigation move into an accessible drawer."
          />
          <div className="docsGridCompact">
            {[
              { icon: Home, label: "Workspaces", value: "4" },
              { icon: FileText, label: "Documents", value: "28" },
              { icon: Search, label: "Searches", value: "12" },
              { icon: BarChart3, label: "Analyses", value: "7" },
            ].map(({ icon: Icon, label, value }) => (
              <Surface elevation="raised" key={label} padding="lg">
                <Stack gap={2}>
                  <Icon aria-hidden size={18} />
                  <Heading level={2}>{value}</Heading>
                  <Text tone="secondary">{label}</Text>
                </Stack>
              </Surface>
            ))}
          </div>
        </div>
      </AppShell>
    );
  },
};

export const ContainerComparison: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Layouts · Containers"
        title="Components respond to their allocation"
        description="The same content composition works in a compact side panel and a flexible main surface without product-specific forks."
      />
      <div className="docsResponsiveFrames">
        <div className="docsFrame">
          <span className="docsFrameLabel">Compact container</span>
          <div className="docsFrameBody">
            <Stack gap={3}>
              <Heading level={2} size="sm">
                Review status
              </Heading>
              <Badge tone="warning">Needs evidence</Badge>
              <Button fullWidth>Open review</Button>
            </Stack>
          </div>
        </div>
        <div className="docsFrame">
          <span className="docsFrameLabel">Flexible container</span>
          <div className="docsFrameBody">
            <PageHeader
              title="Review status"
              description="Two contrast pair changes need approval."
              actions={<Button>Open review</Button>}
            />
          </div>
        </div>
      </div>
    </StoryPage>
  ),
};

export const CompositionPrimitives: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Layouts · Composition"
        title="Intrinsic primitives before product-specific CSS"
        description="Container constrains reading width, Grid owns responsive columns, and Box remains a neutral styling and semantic boundary."
      />
      <Container size="lg">
        <Grid columns={3} gap={4}>
          {[
            ["Foundation", "Semantic tokens establish the shared visual language."],
            ["Components", "Accessible controls turn that language into behavior."],
            ["Templates", "Responsive compositions accelerate complete workflows."],
          ].map(([title, description], index) => (
            <Box className="docsPrimitiveBox" key={title}>
              {index === 0 ? (
                <VisuallyHidden>Beginning of the PADS delivery model.</VisuallyHidden>
              ) : null}
              <Heading level={2} size="sm">
                {title}
              </Heading>
              <Text tone="secondary">{description}</Text>
            </Box>
          ))}
        </Grid>
      </Container>
    </StoryPage>
  ),
};

export const WorkspaceComposition: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <WorkspaceSurface>
      <PageLayout width="wide">
        <PageHeader
          eyebrow="Layouts · Workspace"
          title="Product-neutral workspace composition"
          description="Page, dashboard, and split-pane responsibilities remain independently reusable."
        />
        <DashboardLayout
          main={
            <SplitPane
              label="Design system delivery workflow"
              primary={
                <div className="docsLayoutPane">
                  <Heading level={2} size="sm">
                    Define
                  </Heading>
                  <Text tone="secondary">
                    Compose shared primitives with clear ownership boundaries.
                  </Text>
                </div>
              }
              secondary={
                <div className="docsLayoutPane">
                  <Heading level={2} size="sm">
                    Validate
                  </Heading>
                  <Text tone="secondary">
                    Exercise themes, keyboard paths, and responsive allocations.
                  </Text>
                </div>
              }
            />
          }
          aside={
            <Surface elevation="raised" padding="lg">
              <Stack gap={3}>
                <Heading level={2} size="sm">
                  Release evidence
                </Heading>
                <Badge tone="success">Checks complete</Badge>
                <Text size="sm" tone="muted">
                  Consumer verification confirms the public package surface.
                </Text>
              </Stack>
            </Surface>
          }
        />
      </PageLayout>
    </WorkspaceSurface>
  ),
};
