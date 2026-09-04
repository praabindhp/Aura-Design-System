import {
  Breadcrumbs,
  Heading,
  Pagination,
  SkipLink,
  Stack,
  Tabs,
  Text,
} from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Navigation/Wayfinding",
  parameters: {
    docs: {
      description: {
        component:
          "Wayfinding primitives communicate location and preserve established keyboard models.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const NavigationSet: Story = {
  render: function Render() {
    const [tab, setTab] = useState("overview");
    const [page, setPage] = useState(2);
    return (
      <StoryPage>
        <SkipLink href="#navigation-main">Skip navigation examples</SkipLink>
        <StoryIntro
          eyebrow="Navigation · Wayfinding"
          title="Location, scope, and progress"
          description="Breadcrumbs describe hierarchy, tabs switch views in place, and pagination exposes a stable current position."
        />
        <Stack gap={6}>
          <section className="docsSection">
            <Heading level={2}>Breadcrumbs</Heading>
            <Breadcrumbs
              items={[
                { href: "#home", label: "Design system" },
                { href: "#components", label: "Components" },
                { label: "Navigation" },
              ]}
            />
          </section>
          <section className="docsSection" id="navigation-main">
            <Heading level={2}>Tabs</Heading>
            <Tabs
              ariaLabel="Component information"
              items={[
                {
                  value: "overview",
                  label: "Overview",
                  content: <Text>Purpose, anatomy, and expected behavior.</Text>,
                },
                {
                  value: "accessibility",
                  label: "Accessibility",
                  content: <Text>Keyboard, semantics, announcements, and focus.</Text>,
                },
                {
                  value: "api",
                  label: "API",
                  content: <Text>Owned props and documented export contracts.</Text>,
                },
              ]}
              value={tab}
              onValueChange={setTab}
            />
          </section>
          <section className="docsSection">
            <Heading level={2}>Pagination</Heading>
            <Pagination current={page} pageSize={10} total={84} onChange={setPage} />
          </section>
        </Stack>
      </StoryPage>
    );
  },
};
