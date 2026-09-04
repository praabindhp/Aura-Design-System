import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import type { RenderLink } from "../types";
import { Breadcrumbs, Pagination, SkipLink, Tabs } from "./navigation";

describe("navigation", () => {
  it("renders skip and breadcrumb navigation with a single current page", () => {
    const renderLink = vi.fn(
      ({ children, className, href }: Parameters<RenderLink>[0]) => (
        <a className={className} data-router-link href={href}>
          {children}
        </a>
      ),
    );
    render(
      <div>
        <SkipLink />
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/documents", label: "Documents" },
            { label: "Draft" },
          ]}
          renderLink={renderLink}
        />
        <main id="main">Content</main>
      </div>,
    );

    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main",
    );
    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(breadcrumbs).getByRole("link", { name: "Home" })).toHaveAttribute(
      "data-router-link",
    );
    expect(within(breadcrumbs).getByText("Draft")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(renderLink).toHaveBeenCalledTimes(2);
  });

  it("implements automatic tab activation, wrapping, Home, and End", async () => {
    const user = userEvent.setup();
    const Harness = () => {
      const [value, setValue] = useState("overview");
      return (
        <Tabs
          ariaLabel="Document sections"
          items={[
            { content: "Overview panel", label: "Overview", value: "overview" },
            {
              content: "Restricted panel",
              disabled: true,
              label: "Restricted",
              value: "restricted",
            },
            { content: "History panel", label: "History", value: "history" },
          ]}
          onValueChange={setValue}
          value={value}
        />
      );
    };
    render(<Harness />);

    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "History" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("History panel");

    await user.keyboard("{ArrowRight}");
    expect(overview).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "History" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(overview).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Restricted" })).toBeDisabled();
  });

  it("wraps Ant pagination in a named navigation landmark", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Pagination
        current={1}
        label="Search pages"
        onChange={onChange}
        pageSize={10}
        total={35}
      />,
    );

    const navigation = screen.getByRole("navigation", { name: "Search pages" });
    expect(within(navigation).getByLabelText("Page 1")).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.click(within(navigation).getByLabelText("Next page"));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
