import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable, DescriptionList, Stat } from "./data-display";

describe("data display", () => {
  it("provides a focusable named region and native table relationships", () => {
    render(
      <DataTable
        caption="Recent documents"
        columns={[
          { cell: (row) => row.name, header: "Name", key: "name" },
          { align: "end", cell: (row) => row.words, header: "Words", key: "words" },
        ]}
        getRowKey={(row) => row.id}
        rows={[{ id: "one", name: "Launch brief", words: 420 }]}
      />,
    );

    const region = screen.getByRole("region", { name: "Recent documents" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(within(region).getByRole("table")).toHaveAccessibleName("Recent documents");
    expect(within(region).getByRole("columnheader", { name: "Words" })).toHaveAttribute(
      "scope",
      "col",
    );
    expect(within(region).getByRole("cell", { name: "420" })).toHaveAttribute(
      "data-align",
      "end",
    );
  });

  it("renders description terms and metric content without flattening semantics", () => {
    render(
      <div>
        <DescriptionList
          columns={2}
          items={[
            { label: "Owner", value: "Praabindh" },
            { label: "Status", value: "Ready" },
          ]}
        />
        <Stat hint="Across this month" label="Documents" value="12" />
      </div>,
    );

    expect(screen.getByText("Owner").tagName).toBe("DT");
    expect(screen.getByText("Praabindh").tagName).toBe("DD");
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("12").tagName).toBe("STRONG");
    expect(screen.getByText("Across this month")).toBeInTheDocument();
  });
});
