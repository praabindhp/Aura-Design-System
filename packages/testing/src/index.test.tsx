import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  auditAccessibility,
  expectNoAccessibilityViolations,
  installMatchMedia,
  renderWithAura,
} from "./index";

describe("renderWithAura", () => {
  it("renders consumers in a scoped, deterministic light theme", () => {
    renderWithAura(<button type="button">Save</button>, {
      provider: { brand: "verbaura", storageKey: null },
    });

    expect(screen.queryByRole("button", { name: "Save" })).not.toBeNull();
    expect(
      screen.getByRole("button").parentElement?.getAttribute("data-aura-theme"),
    ).toBe("light");
  });
});

describe("installMatchMedia", () => {
  it("updates modern, legacy, object, and onchange listeners", () => {
    const original = Object.getOwnPropertyDescriptor(window, "matchMedia");
    const controller = installMatchMedia({
      "(prefers-reduced-motion: reduce)": false,
    });
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const modern = vi.fn();
    const legacy = vi.fn();
    const onchange = vi.fn();
    const objectListener = { handleEvent: vi.fn() };

    query.addEventListener("change", modern);
    query.addEventListener("change", objectListener);
    query.addListener(legacy);
    query.addListener(null);
    query.removeListener(null);
    query.onchange = onchange;

    controller.setMatches("(prefers-reduced-motion: reduce)", true);
    controller.setMatches("(prefers-reduced-motion: reduce)", true);

    expect(query.matches).toBe(true);
    expect(modern).toHaveBeenCalledOnce();
    expect(legacy).toHaveBeenCalledOnce();
    expect(onchange).toHaveBeenCalledOnce();
    expect(objectListener.handleEvent).toHaveBeenCalledOnce();
    expect(modern.mock.calls[0]?.[0]).toMatchObject({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
    });

    query.removeEventListener("change", modern);
    query.removeListener(legacy);
    controller.setMatches("(prefers-reduced-motion: reduce)", false);
    expect(modern).toHaveBeenCalledOnce();
    expect(legacy).toHaveBeenCalledOnce();
    expect(onchange).toHaveBeenCalledTimes(2);

    controller.restore();
    controller.restore();
    expect(Object.getOwnPropertyDescriptor(window, "matchMedia")).toEqual(original);
  });

  it("honors once and abort options", () => {
    const controller = installMatchMedia();
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const once = vi.fn();
    const aborted = vi.fn();
    const abortController = new AbortController();

    query.addEventListener("change", once, { once: true });
    query.addEventListener("change", aborted, { signal: abortController.signal });
    abortController.abort();
    controller.setMatches("(prefers-color-scheme: dark)", true);
    controller.setMatches("(prefers-color-scheme: dark)", false);

    expect(once).toHaveBeenCalledOnce();
    expect(aborted).not.toHaveBeenCalled();
    controller.restore();
  });
});

describe("accessibility audits", () => {
  it("returns axe results with and without explicit options", async () => {
    const { container } = renderWithAura(<button type="button">Create</button>);
    const emptyContext = document.body.appendChild(document.createElement("div"));

    const complete = await auditAccessibility(emptyContext);
    const focused = await auditAccessibility(container, {
      runOnly: ["button-name"],
    });

    expect(complete.violations).toEqual([]);
    expect(focused.violations).toEqual([]);
    await expect(
      expectNoAccessibilityViolations(container, { runOnly: ["button-name"] }),
    ).resolves.toBeUndefined();
    emptyContext.remove();
  });

  it("reports typed violation details", async () => {
    const { container } = renderWithAura(<img src="/preview.png" />);

    await expect(
      expectNoAccessibilityViolations(container, {
        runOnly: ["image-alt"],
      }),
    ).rejects.toThrow(/image-alt: Images must have alternative text \(1 nodes\)/u);
  });
});
