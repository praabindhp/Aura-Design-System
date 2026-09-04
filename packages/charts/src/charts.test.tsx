import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  ActivityChart,
  ChartGrid,
  ColumnChart,
  DonutChart,
  HorizontalBarChart,
  RadialChart,
} from "./index.js";

const data = [
  { label: "Drafts", value: 12, tone: "brand" as const },
  { label: "Published", value: 8, tone: "success" as const },
];

describe("Aura charts", () => {
  it("gives column charts an accessible image summary and exact data table", () => {
    const { container } = render(
      <ColumnChart ariaLabel="Documents by status" data={data} title="Documents" />,
    );

    expect(
      screen.getByRole("img", { name: "Documents by status" }),
    ).toBeInTheDocument();
    const table = screen.getByRole("table", { name: "Documents by status" });
    expect(within(table).getByText("Drafts")).toBeInTheDocument();
    expect(within(table).getByText("12")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("uses intrinsic SVG width so large datasets remain readable", () => {
    const manyItems = Array.from({ length: 12 }, (_, index) => ({
      label: `Item ${index + 1}`,
      value: index + 1,
    }));
    const { container } = render(
      <ColumnChart ariaLabel="Large dataset" data={manyItems} />,
    );

    expect(
      Number(container.querySelector("svg")?.getAttribute("width")),
    ).toBeGreaterThan(900);
  });

  it("renders an explicit empty state when a chart has no positive values", () => {
    render(
      <HorizontalBarChart
        ariaLabel="Empty usage"
        data={[{ label: "Invalid", value: Number.NaN }]}
        emptyMessage="Nothing recorded yet"
      />,
    );

    expect(screen.getByText("Nothing recorded yet")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Empty usage" })).toBeInTheDocument();
  });

  it("clamps radial values and exposes the normalized value", () => {
    render(<RadialChart ariaLabel="Storage usage" value={140} label="used" />);

    expect(screen.getAllByText("100%")).toHaveLength(2);
    expect(screen.getByRole("table", { name: "Storage usage" })).toHaveTextContent(
      "used100%",
    );
  });

  it("renders donut totals and semantic legend labels", () => {
    render(<DonutChart ariaLabel="Asset origins" centerLabel="assets" data={data} />);

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getAllByText("Drafts").length).toBeGreaterThan(0);
  });

  it("distinguishes activity series by pattern as well as tone", () => {
    const { container } = render(
      <ActivityChart
        ariaLabel="Weekly writing activity"
        points={[
          { label: "Mon", values: { words: 4, edits: 2 } },
          { label: "Tue", values: { words: 8, edits: 5 } },
        ]}
        series={[
          { key: "words", label: "Words", tone: "brand" },
          { key: "edits", label: "Edits", tone: "brand" },
        ]}
      />,
    );

    expect(container.querySelector('[data-pattern="0"]')).toBeInTheDocument();
    expect(container.querySelector('[data-pattern="1"]')).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Weekly writing activity" }),
    ).toHaveTextContent("Mon");
  });

  it("provides a responsive grid without imposing product layout", () => {
    render(
      <ChartGrid minimumColumnWidth="wide" data-testid="grid">
        <div>First</div>
        <div>Second</div>
      </ChartGrid>,
    );

    expect(screen.getByTestId("grid")).toHaveAttribute(
      "data-minimum-column-width",
      "wide",
    );
  });
});
