import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AuraProvider,
  AuraThemeScript,
  ThemeToggle,
  getAuraThemeScript,
  useAura,
} from "./AuraProvider";

function createMediaPreference(initiallyDark = false) {
  let matches = initiallyDark;
  const listeners = new Set<() => void>();
  const media = {
    get matches() {
      return matches;
    },
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) =>
      listeners.delete(listener),
    addListener: (listener: () => void) => listeners.add(listener),
    removeListener: (listener: () => void) => listeners.delete(listener),
    dispatchEvent: () => true,
  } as unknown as MediaQueryList;

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => media),
  });

  return {
    setDark(next: boolean) {
      matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}

function ContextProbe() {
  const { brand, mode, preference, setPreference } = useAura();
  return (
    <div>
      <output aria-label="brand">{brand}</output>
      <output aria-label="mode">{mode}</output>
      <output aria-label="preference">{preference}</output>
      <button type="button" onClick={() => setPreference("system")}>
        Follow system
      </button>
      <ThemeToggle />
    </div>
  );
}

afterEach(() => {
  document.documentElement.removeAttribute("data-aura-brand");
  document.documentElement.removeAttribute("data-aura-root");
  document.documentElement.removeAttribute("data-aura-theme");
  document.documentElement.style.removeProperty("color-scheme");
  document.head.querySelector('meta[name="theme-color"]')?.remove();
  window.localStorage.clear();
});

describe("AuraProvider", () => {
  it("applies a light theme to a local scope without mutating the document", () => {
    createMediaPreference();
    const { container } = render(
      <AuraProvider
        applyTo="scope"
        brand="verbaura"
        defaultTheme="light"
        storageKey={null}
      >
        <ContextProbe />
      </AuraProvider>,
    );

    const scope = container.querySelector("[data-aura-root]");
    expect(scope).toHaveAttribute("data-aura-scope", "");
    expect(scope).toHaveAttribute("data-aura-brand", "verbaura");
    expect(scope).toHaveAttribute("data-aura-theme", "light");
    expect(screen.getByLabelText("mode")).toHaveTextContent("light");
    expect(screen.getByLabelText("preference")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveAttribute("data-aura-theme");
  });

  it("follows system changes and exposes an accessible theme toggle", async () => {
    const preference = createMediaPreference();
    const user = userEvent.setup();
    const { container } = render(
      <AuraProvider
        applyTo="scope"
        brand="cognaura"
        defaultTheme="system"
        storageKey={null}
      >
        <ContextProbe />
      </AuraProvider>,
    );

    expect(screen.getByLabelText("mode")).toHaveTextContent("light");
    expect(screen.getByRole("button", { name: "Use dark theme" })).toBeEnabled();

    act(() => preference.setDark(true));
    expect(screen.getByLabelText("mode")).toHaveTextContent("dark");
    expect(container.querySelector("[data-aura-root]")).toHaveAttribute(
      "data-aura-theme",
      "dark",
    );

    await user.click(screen.getByRole("button", { name: "Use light theme" }));
    expect(screen.getByLabelText("preference")).toHaveTextContent("light");
    expect(screen.getByLabelText("mode")).toHaveTextContent("light");
  });

  it("persists valid preferences and ignores invalid saved values", async () => {
    createMediaPreference();
    window.localStorage.setItem("product-theme", "sepia");
    const user = userEvent.setup();
    render(
      <AuraProvider applyTo="scope" defaultTheme="dark" storageKey="product-theme">
        <ContextProbe />
      </AuraProvider>,
    );

    expect(screen.getByLabelText("preference")).toHaveTextContent("dark");
    await user.click(screen.getByRole("button", { name: "Use light theme" }));
    expect(window.localStorage.getItem("product-theme")).toBe("light");
  });

  it("supports controlled themes and reports requested changes", async () => {
    createMediaPreference();
    const onThemeChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AuraProvider
        applyTo="scope"
        onThemeChange={onThemeChange}
        storageKey={null}
        theme="dark"
      >
        <ThemeToggle labels={{ dark: "Dark", light: "Light" }} />
      </AuraProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Light" }));
    expect(onThemeChange).toHaveBeenCalledWith("light", "light");
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
  });

  it("applies and restores document attributes and browser chrome color", () => {
    createMediaPreference();
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "initial";
    document.head.append(meta);

    const { unmount } = render(
      <AuraProvider brand="rendaura" defaultTheme="dark" storageKey={null}>
        <span>Content</span>
      </AuraProvider>,
    );

    expect(document.documentElement).toHaveAttribute("data-aura-brand", "rendaura");
    expect(document.documentElement).toHaveAttribute("data-aura-theme", "dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(meta.content).not.toBe("initial");

    unmount();
    expect(document.documentElement).not.toHaveAttribute("data-aura-brand");
    expect(document.documentElement).not.toHaveAttribute("data-aura-theme");
    expect(document.documentElement.style.colorScheme).toBe("");
    expect(meta.content).toBe("initial");
  });

  it("builds a deterministic pre-hydration script and validates brands", () => {
    const script = getAuraThemeScript({
      brand: "charteraura-intermediate",
      defaultTheme: "system",
      storageKey: "charter-theme",
    });
    expect(script).toContain("prefers-color-scheme: dark");
    expect(script).toContain("charteraura-intermediate");
    expect(() => getAuraThemeScript({ brand: "unknown" as "aura" })).toThrow(
      "Unknown Aura brand",
    );
    expect(() => getAuraThemeScript({ defaultTheme: "sepia" as "light" })).toThrow(
      "Unknown Aura theme preference",
    );
  });

  it("renders a nonce-bearing inline theme script", () => {
    const { container } = render(
      <AuraThemeScript
        brand="aura"
        defaultTheme="light"
        nonce="nonce-value"
        storageKey={null}
      />,
    );
    const script = container.querySelector("script");
    expect(script).toHaveAttribute("nonce", "nonce-value");
    expect(script?.textContent).toContain("dataset.auraTheme");
  });

  it("escapes script-closing storage keys and isolates storage failures", () => {
    const script = getAuraThemeScript({
      defaultTheme: "dark",
      storageKey: "theme</script><script>alert(1)</script>",
    });
    expect(script).not.toContain("</script>");
    expect(script).toContain("try{var v=localStorage.getItem");
    expect(script).toContain("catch(e){}}try{var d=");
  });

  it("requires useAura consumers to be nested in the provider", () => {
    const OutsideConsumer = () => {
      useAura();
      return null;
    };
    expect(() => render(<OutsideConsumer />)).toThrow(
      "useAura must be used within AuraProvider",
    );
  });
});
