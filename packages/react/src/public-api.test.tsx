import * as publicApi from "./index";
import { describe, expect, it } from "vitest";

describe("React package boundary", () => {
  it("exports the design-system tiers from one stable entry point", () => {
    for (const name of [
      "AuraProvider",
      "Button",
      "DataTable",
      "Dialog",
      "Input",
      "DropdownSelect",
      "PageHeader",
      "AppShell",
      "AuthTemplate",
    ]) {
      expect(publicApi).toHaveProperty(name);
    }
  });

  it("does not fold the optional chart package into the React package", () => {
    for (const chart of [
      "ActivityChart",
      "ChartGrid",
      "ColumnChart",
      "DonutChart",
      "HorizontalBarChart",
      "RadialChart",
    ]) {
      expect(publicApi).not.toHaveProperty(chart);
    }
  });
});
