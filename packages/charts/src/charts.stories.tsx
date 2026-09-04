import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ActivityChart,
  ChartGrid,
  ColumnChart,
  DonutChart,
  RadialChart,
} from "./index.js";

const meta = {
  title: "Optional packages/Charts",
  component: ColumnChart,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ColumnChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const usage = [
  { label: "Documents", value: 18, tone: "brand" as const },
  { label: "Humanizations", value: 31, tone: "info" as const },
  { label: "Searches", value: 12, tone: "success" as const },
  { label: "Exports", value: 7, tone: "warning" as const },
];

export const Columns: Story = {
  args: {
    ariaLabel: "Outputs created this month by workflow",
    title: "Monthly outputs",
    description: "Completed activity across the Aura workspace.",
    data: usage,
  },
};

export const DashboardComposition: Story = {
  args: {
    ariaLabel: "Chart dashboard",
    data: [],
  },
  render: () => (
    <ChartGrid>
      <DonutChart
        ariaLabel="Breakdown of monthly activity"
        title="Activity breakdown"
        data={usage}
      />
      <RadialChart
        ariaLabel="Monthly capacity is 64 percent used"
        title="Monthly capacity"
        value={64}
      />
    </ChartGrid>
  ),
};

export const Activity: Story = {
  args: {
    ariaLabel: "Weekly activity",
    data: [],
  },
  render: () => (
    <ActivityChart
      ariaLabel="Documents and searches completed during the past seven days"
      title="Weekly activity"
      points={[
        { label: "Mon", values: { documents: 6, searches: 2 } },
        { label: "Tue", values: { documents: 10, searches: 7 } },
        { label: "Wed", values: { documents: 8, searches: 4 } },
        { label: "Thu", values: { documents: 14, searches: 9 } },
        { label: "Fri", values: { documents: 18, searches: 11 } },
      ]}
      series={[
        { key: "documents", label: "Documents", tone: "brand" },
        { key: "searches", label: "Searches", tone: "info" },
      ]}
    />
  ),
};
