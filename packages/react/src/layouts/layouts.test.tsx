import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuraProvider } from "../provider";
import {
  AppShell,
  DashboardLayout,
  PageLayout,
  SidebarLayout,
  SplitPane,
  TopBar,
  WorkspaceSurface,
} from "./layouts";

describe("layouts", () => {
  it("uses main, aside, and named section landmarks", () => {
    render(
      <WorkspaceSurface>
        <PageLayout width="reading">
          <DashboardLayout aside={<h2>Tools</h2>} main={<h1>Dashboard</h1>} />
          <SplitPane
            label="Comparison"
            primary={<p>Original</p>}
            secondary={<p>Rephrased</p>}
          />
        </PageLayout>
      </WorkspaceSurface>,
    );

    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(
      screen.getByRole("heading", { name: "Tools" }).closest("aside"),
    ).toBeInTheDocument();
    const split = screen.getByRole("region", { name: "Comparison" });
    expect(split).toHaveTextContent("Original");
    expect(split).toHaveTextContent("Rephrased");
    expect(
      screen.getByRole("main").querySelector("[data-width=reading]"),
    ).toBeInTheDocument();
  });

  it("composes sidebar and top-bar slots", () => {
    render(
      <div>
        <SidebarLayout
          footer={<span>Monthly usage</span>}
          header={<strong>VerbAura</strong>}
          navigation={
            <nav aria-label="Primary">
              <a href="/dashboard">Dashboard</a>
            </nav>
          }
        />
        <TopBar
          actions={<button type="button">Profile</button>}
          center={
            <label>
              Search <input />
            </label>
          }
          leading="Documents"
        />
      </div>,
    );

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByText("Monthly usage")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  });

  it("requests mobile navigation changes from named controls", () => {
    const onMobileNavigationChange = vi.fn();
    render(
      <AuraProvider applyTo="scope" defaultTheme="light" storageKey={null}>
        <AppShell
          header={<span>Header</span>}
          mobileNavigationLabel="Workspace navigation"
          mobileNavigationOpen={false}
          onMobileNavigationChange={onMobileNavigationChange}
          sidebar={
            <nav aria-label="Workspace">
              <a href="/home">Home</a>
            </nav>
          }
        >
          <h1>Workspace</h1>
        </AppShell>
      </AuraProvider>,
    );

    const mobileControl = screen.getByRole("button", {
      hidden: true,
      name: "Open workspace navigation",
    });
    fireEvent.click(mobileControl);
    expect(onMobileNavigationChange).toHaveBeenCalledWith(true);
    const main = screen.getByRole("main");
    expect(
      within(main).getByRole("heading", { name: "Workspace" }),
    ).toBeInTheDocument();
  });
});
