import {
  Badge,
  DataTable,
  DescriptionList,
  Heading,
  Stat,
  Surface,
} from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Data display/Tables and values",
  parameters: {
    docs: {
      description: {
        component:
          "Structured data remains readable, labelled, and scrollable at narrow widths without hiding exact values.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface PackageRow {
  readonly name: string;
  readonly status: "Ready" | "Review";
  readonly surface: string;
  readonly version: string;
}

const rows: ReadonlyArray<PackageRow> = [
  {
    name: "React",
    status: "Ready",
    surface: "Components and templates",
    version: "1.0.0",
  },
  {
    name: "Tokens",
    status: "Ready",
    surface: "CSS, JSON, TypeScript",
    version: "1.0.0",
  },
  {
    name: "Charts",
    status: "Ready",
    surface: "Accessible visualizations",
    version: "1.0.0",
  },
  {
    name: "Rich content",
    status: "Review",
    surface: "Safe Markdown",
    version: "1.0.0",
  },
];

export const PackageInventory: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Data display · Structured values"
        title="Exact data with responsive presentation"
        description="The table has a programmatic caption and a keyboard-scrollable region. Status never depends on color alone."
      />
      <div className="docsFlow">
        <div className="docsGridCompact">
          <Surface elevation="raised" padding="lg">
            <Stat
              label="Published packages"
              value="5"
              hint="Synchronized release train"
            />
          </Surface>
          <Surface elevation="raised" padding="lg">
            <Stat label="Supported themes" value="2" hint="Light and dark" />
          </Surface>
          <Surface elevation="raised" padding="lg">
            <Stat label="Brand recipes" value="6" hint="Including neutral Aura" />
          </Surface>
        </div>
        <DataTable
          caption="PADS package readiness"
          columns={[
            { key: "name", header: "Package", cell: (row: PackageRow) => row.name },
            {
              key: "surface",
              header: "Surface",
              cell: (row: PackageRow) => row.surface,
            },
            {
              key: "version",
              header: "Version",
              cell: (row: PackageRow) => row.version,
            },
            {
              key: "status",
              header: "Status",
              cell: (row: PackageRow) => (
                <Badge tone={row.status === "Ready" ? "success" : "warning"}>
                  {row.status}
                </Badge>
              ),
            },
          ]}
          getRowKey={(row) => row.name}
          rows={rows}
        />
        <section className="docsSection">
          <Heading level={2}>Release metadata</Heading>
          <DescriptionList
            columns={2}
            items={[
              { label: "Owner", value: "PRAABINDH CORP" },
              { label: "Registry access", value: "Restricted" },
              { label: "Runtime", value: "React 19" },
              { label: "Accessibility", value: "WCAG 2.2 AA" },
            ]}
          />
        </section>
      </div>
    </StoryPage>
  ),
};
