import { ChartGrid, DonutChart, RadialChart } from "@praabindh/aura-charts";
import {
  AuraProvider,
  Badge,
  Button,
  CardGrid,
  MetricCard,
  PageHeader,
  PageLayout,
  ProductMark,
  DropdownSelect,
  Stack,
  Surface,
  ThemeToggle,
  type AuraBrand,
} from "@praabindh/aura-design-system";
import { RichMarkdown } from "@praabindh/aura-rich-content";
import { Activity, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";

const brands: ReadonlyArray<{ readonly label: string; readonly value: AuraBrand }> = [
  { label: "Aura", value: "aura" },
  { label: "VerbAura", value: "verbaura" },
  { label: "CognAura", value: "cognaura" },
  { label: "RendAura", value: "rendaura" },
  { label: "CharterAura", value: "charteraura" },
  { label: "CharterAura Intermediate", value: "charteraura-intermediate" },
];

const markdown = `## Public-package integration

This fixture imports only documented entry points and exercises:

- the shared provider and semantic themes;
- responsive React components;
- optional chart and rich-content packages.

\`npm run package:check\` installs fresh package tarballs into an isolated copy of this fixture.`;

function ConsumerContent({ brand }: { readonly brand: AuraBrand }) {
  return (
    <PageLayout>
      <Stack gap={6}>
        <PageHeader
          eyebrow="Packed consumer"
          title="Aura Design System"
          description="A clean Vite application proving package exports, styles, peers, and optional boundaries."
          actions={
            <div className="consumerActions">
              <Badge tone="success" icon={<CheckCircle2 aria-hidden size={14} />}>
                Connected
              </Badge>
              <ThemeToggle />
            </div>
          }
        />

        <CardGrid columns={3}>
          <MetricCard
            hint="All semantic modes"
            hintTone="success"
            icon={Sparkles}
            label="Theme contracts"
            value="2"
          />
          <MetricCard
            hint="Shared product recipes"
            hintTone="success"
            icon={Activity}
            label="Brand recipes"
            value="6"
          />
          <Surface className="consumerBrand" elevation="raised">
            <ProductMark brand={brand} size="lg" />
            <div>
              <strong>Current brand</strong>
              <span>{brand}</span>
            </div>
          </Surface>
        </CardGrid>

        <ChartGrid>
          <DonutChart
            ariaLabel="Package quality evidence"
            title="Quality evidence"
            description="Exact values remain available in the chart data table."
            data={[
              { label: "Behavior", value: 42, tone: "brand" },
              { label: "Accessibility", value: 34, tone: "success" },
              { label: "Packaging", value: 24, tone: "info" },
            ]}
            centerLabel="checks"
            centerValue="100%"
          />
          <RadialChart
            ariaLabel="Consumer build readiness"
            title="Consumer readiness"
            description="Representative integration status."
            value={100}
            label="ready"
          />
        </ChartGrid>

        <Surface elevation="raised" padding="lg">
          <RichMarkdown>{markdown}</RichMarkdown>
        </Surface>

        <Button startIcon={<Sparkles aria-hidden size={16} />}>Create with PADS</Button>
      </Stack>
    </PageLayout>
  );
}

export function App() {
  const [brand, setBrand] = useState<AuraBrand>("aura");

  return (
    <AuraProvider brand={brand} defaultTheme="system">
      <header className="consumerToolbar">
        <ProductMark brand={brand} size="sm" />
        <DropdownSelect
          aria-label="Preview brand"
          options={brands}
          value={brand}
          onValueChange={setBrand}
        />
      </header>
      <main className="consumerMain" id="main">
        <ConsumerContent brand={brand} />
      </main>
    </AuraProvider>
  );
}
