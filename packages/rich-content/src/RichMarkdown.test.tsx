import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import { RichMarkdown } from "./index.js";

describe("RichMarkdown", () => {
  it("renders GFM content and a keyboard-accessible scrolling table", () => {
    render(
      <RichMarkdown>{`| Product | Status |
| --- | --- |
| VerbAura | Ready |

- [x] Accessible`}</RichMarkdown>,
    );

    expect(screen.getByRole("region", { name: "Markdown table" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("cell", { name: "Ready" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("opens external links safely while preserving relative navigation", () => {
    render(
      <RichMarkdown>{`[Docs](https://example.com/docs) [Settings](/settings)`}</RichMarkdown>,
    );

    expect(screen.getByRole("link", { name: /Docs/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByRole("link", { name: /Docs/ })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "Settings" })).not.toHaveAttribute(
      "target",
    );
  });

  it("blocks unsafe protocols and ignores embedded raw HTML", () => {
    const { container } = render(
      <RichMarkdown>{`[Unsafe](javascript:alert(1))

<button id="untrusted">Do not render</button>`}</RichMarkdown>,
    );

    expect(screen.queryByRole("link", { name: "Unsafe" })).not.toBeInTheDocument();
    expect(container.querySelector("#untrusted")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Do not render" }),
    ).not.toBeInTheDocument();
  });

  it("omits remote images by default and hardens explicitly allowed images", () => {
    const markdown = "![Workspace preview](https://example.com/aura.png)";
    const { rerender } = render(<RichMarkdown>{markdown}</RichMarkdown>);

    expect(screen.getByText("Image omitted: Workspace preview")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    rerender(<RichMarkdown allowImages>{markdown}</RichMarkdown>);
    expect(screen.getByRole("img", { name: "Workspace preview" })).toHaveAttribute(
      "referrerpolicy",
      "no-referrer",
    );
    expect(screen.getByRole("img", { name: "Workspace preview" })).toHaveAttribute(
      "loading",
      "lazy",
    );
  });

  it("awaits successful code copies before reporting success", async () => {
    const user = userEvent.setup();
    const copyCode = vi.fn().mockResolvedValue(undefined);
    const onCodeCopy = vi.fn();
    render(
      <RichMarkdown copyCode={copyCode} onCodeCopy={onCodeCopy}>
        {"```ts\nconst aura = true;\n```"}
      </RichMarkdown>,
    );

    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(copyCode).toHaveBeenCalledWith("const aura = true;");
    expect(onCodeCopy).toHaveBeenCalledWith(
      expect.objectContaining({ status: "success", language: "ts", error: null }),
    );
  });

  it("surfaces clipboard failures instead of claiming success", async () => {
    const user = userEvent.setup();
    const copyCode = vi.fn().mockRejectedValue(new Error("denied"));
    const onCodeCopy = vi.fn();
    render(
      <RichMarkdown copyCode={copyCode} onCodeCopy={onCodeCopy}>
        {"```\nsecret-safe example\n```"}
      </RichMarkdown>,
    );

    await user.click(screen.getByRole("button", { name: "Copy" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Copy failed" })).toBeInTheDocument(),
    );
    expect(onCodeCopy).toHaveBeenCalledWith(
      expect.objectContaining({ status: "error", language: null }),
    );
  });
});
