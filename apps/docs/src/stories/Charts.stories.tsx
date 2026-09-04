import {
  ActivityChart,
  ChartGrid,
  ColumnChart,
  DonutChart,
  HorizontalBarChart,
  RadialChart,
} from "@praabindh/aura-charts";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Optional packages/Charts",
  parameters: {
    docs: {
      description: {
        component:
          "Charts live outside the base React bundle and always pair visual geometry with exact, assistive-technology-readable values.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const activityPoints = [
  { label: "Mon", values: { words: 480, reviews: 120 } },
  { label: "Tue", values: { words: 620, reviews: 180 } },
  { label: "Wed", values: { words: 540, reviews: 240 } },
  { label: "Thu", values: { words: 820, reviews: 260 } },
  { label: "Fri", values: { words: 760, reviews: 320 } },
] as const;

const channelData = [
  { label: "Documents", value: 42, tone: "brand" as const },
  { label: "Conversations", value: 28, tone: "info" as const },
  { label: "Analyses", value: 18, tone: "success" as const },
  { label: "Searches", value: 12, tone: "warning" as const },
];

export const UsageDashboard: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Optional package · Charts"
        title="Accessible insight without flashing color"
        description="Every visualization has a concise accessible name, a hidden exact-value table, restrained semantic tones, and a meaningful empty state."
      />
      <div className="docsFlow">
        <ActivityChart
          ariaLabel="Weekly writing activity"
          title="Writing activity"
          description="Words produced and reviews completed across the working week."
          points={activityPoints}
          series={[
            { key: "words", label: "Words", tone: "brand", emphasis: "primary" },
            { key: "reviews", label: "Reviews", tone: "info", emphasis: "secondary" },
          ]}
          valueLabel="items"
        />
        <ChartGrid minimumColumnWidth="compact">
          <ColumnChart
            ariaLabel="Outputs by workspace area"
            title="Output mix"
            data={channelData}
          />
          <DonutChart
            ariaLabel="Assets by source"
            title="Asset origins"
            data={channelData}
            centerLabel="assets"
            centerValue="100"
          />
          <RadialChart
            ariaLabel="Monthly output capacity"
            title="Monthly capacity"
            description="Successful generated and edited outputs."
            value={62}
            label="used"
          />
        </ChartGrid>
      </div>
    </StoryPage>
  ),
};

export const ComparisonAndEmpty: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Optional package · Chart states"
        title="Comparison, summary, and empty data"
        description="A zero dataset explains the absence of activity rather than rendering misleading geometry."
      />
      <ChartGrid>
        <HorizontalBarChart
          ariaLabel="Completion by quality gate"
          title="Quality gate completion"
          valueLabel="percent complete"
          valueFormatter={(value) => `${value}%`}
          data={[
            { label: "Accessibility", value: 100, tone: "success" },
            { label: "Package integrity", value: 92, tone: "brand" },
            { label: "Browser coverage", value: 76, tone: "info" },
          ]}
        />
        <ColumnChart
          ariaLabel="No activity in selected period"
          title="Selected period"
          emptyMessage="No activity for this period"
          data={[]}
        />
      </ChartGrid>
    </StoryPage>
  ),
};
