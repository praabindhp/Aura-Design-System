import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Brain, FileText, Image, Settings } from "lucide-react";
import { useState, type FormEvent } from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AuraProvider } from "../provider";
import {
  ActionCard,
  CardGrid,
  CommandPalette,
  ComposerDock,
  ContextPalette,
  MediaCard,
  MediaGrid,
  MediaPreview,
  MetricCard,
  PageHeader,
  ReferenceCard,
  Section,
  SettingsGroup,
  SettingsLayout,
  SettingsPanel,
  SettingsRow,
  StatusBadge,
  UsageCard,
  type PaletteItem,
} from "./index";

const paletteItems: readonly PaletteItem[] = [
  {
    description: "Start a conversation",
    icon: Brain,
    id: "chat",
    label: "AI Playground",
  },
  { disabled: true, icon: FileText, id: "disabled", label: "Unavailable" },
  { category: "Library", icon: Image, id: "media", label: "Media library" },
];

const getComputedStyle = window.getComputedStyle.bind(window);

beforeAll(() => {
  vi.spyOn(window, "getComputedStyle").mockImplementation((element) =>
    getComputedStyle(element),
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("dashboard patterns", () => {
  it("renders an optional PageHeader icon as a component regression", () => {
    render(
      <PageHeader
        actions={<button type="button">Create</button>}
        description="A clear view of your workspace"
        eyebrow="PRAABINDH CORP"
        icon={Brain}
        title="CognAura"
      />,
    );

    const heading = screen.getByRole("heading", { level: 1, name: "CognAura" });
    const header = heading.closest("header");
    expect(header?.querySelector("svg")).toBeInTheDocument();
    expect(header?.querySelector("svg")?.closest("span")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("composes sections, grids, actions, metrics, status, and bounded usage", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <div>
        <Section
          action={<a href="/all">View all</a>}
          description="Common actions"
          title="Tools"
        >
          <CardGrid columns={2} label="Available tools">
            <ActionCard
              description="Chat and research"
              icon={Brain}
              onClick={onClick}
              title="Playground"
            />
            <ActionCard
              description="Not yet available"
              disabled
              icon={Settings}
              onClick={onClick}
              title="Admin"
            />
          </CardGrid>
        </Section>
        <MetricCard
          hint="Across completed runs"
          hintTone="success"
          icon={FileText}
          label="Documents"
          value="12"
        />
        <StatusBadge icon={Brain} tone="success">
          Ready
        </StatusBadge>
        <UsageCard current={120} max={100} unit="outputs" />
      </div>,
    );

    await user.click(
      screen.getByRole("button", { name: /Playground Chat and research/u }),
    );
    expect(onClick).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("button", { name: /Admin Not yet available/u }),
    ).toBeDisabled();
    expect(screen.getByRole("article", { name: "Documents" })).toHaveTextContent("12");
    expect(screen.getByText("Ready")).toHaveAttribute("data-tone", "success");
    expect(
      screen.getByRole("progressbar", { name: "Monthly usage: 100% used" }),
    ).toHaveAttribute("value", "100");
    expect(screen.getByText("0 outputs remaining")).toBeInTheDocument();
  });
});

describe("media patterns", () => {
  it("keeps a MediaCard inert when no action is provided", () => {
    render(
      <MediaCard
        description="Generated today"
        metadata="PNG"
        preview={
          <MediaPreview
            alt="Sunset over mountains"
            fallback={<span>Preview unavailable</span>}
          />
        }
        title="Mountain study"
      />,
    );

    const article = screen.getByText("Mountain study").closest("article");
    expect(article).toHaveAttribute("data-interactive", "false");
    expect(
      within(article as HTMLElement).queryByRole("button"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Preview unavailable")).toBeInTheDocument();
  });

  it("creates a named button only when MediaCard has an action", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <MediaGrid label="Recent media">
        <MediaCard
          onSelect={onSelect}
          preview={
            <MediaPreview alt="Abstract waves" ratio="landscape" src="/waves.png" />
          }
          title="Abstract waves"
        />
      </MediaGrid>,
    );

    expect(screen.getByRole("img", { name: "Abstract waves" })).toHaveAttribute(
      "src",
      "/waves.png",
    );
    await user.click(screen.getByRole("button", { name: "View Abstract waves" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("supports video previews and independent reference actions", () => {
    render(
      <ReferenceCard
        action={<button type="button">Remove</button>}
        description="Uploaded reference"
        preview={<MediaPreview alt="Motion reference" src="/motion.mp4" type="video" />}
        title="Motion"
      />,
    );
    expect(screen.getByLabelText("Motion reference").tagName).toBe("VIDEO");
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });
});

describe("conversation patterns", () => {
  it("moves through context options, skips disabled items, closes, and selects", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(
      <ContextPalette
        items={paletteItems}
        label="Insert context"
        onClose={onClose}
        onSelect={onSelect}
      />,
    );

    const first = screen.getByRole("option", { name: /AI Playground/u });
    first.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: /Media library/u })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("option", { name: /Media library/u }));
    expect(onSelect).toHaveBeenCalledWith(paletteItems[2]);
  });

  it("renders the context empty state", () => {
    render(
      <ContextPalette
        emptyMessage="Nothing found"
        items={[]}
        label="Commands"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("Nothing found")).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("expands the composer, focuses its editor, submits, and collapses on Escape", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );
    render(
      <ComposerDock
        action={<button type="submit">Send</button>}
        brand="cognaura"
        collapsedLabel="Open assistant"
        editor={<textarea aria-label="Message" />}
        label="Ask CognAura"
        name="CognAura"
        onSubmit={onSubmit}
      />,
    );

    const dock = screen.getByRole("group", { name: "Ask CognAura dock" });
    expect(dock).toHaveAttribute("data-expanded", "false");
    await user.click(screen.getByRole("button", { name: "Open assistant" }));
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveFocus();
    expect(dock).toHaveAttribute("data-expanded", "true");
    await user.keyboard("{Escape}");
    expect(dock).toHaveAttribute("data-expanded", "false");
    expect(screen.getByRole("button", { name: "Open assistant" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Open assistant" }));
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(dock).toHaveAttribute("data-expanded", "false");
  });

  it("does not expose an active option when every context action is disabled", () => {
    render(
      <ContextPalette
        items={[{ disabled: true, icon: Brain, id: "locked", label: "Locked" }]}
        label="Unavailable context"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByRole("listbox")).not.toHaveAttribute("aria-activedescendant");
    expect(screen.getByRole("option", { name: "Locked" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("filters and selects commands in the modal palette", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(
      <AuraProvider applyTo="scope" defaultTheme="light" storageKey={null}>
        <CommandPalette
          items={paletteItems}
          onClose={onClose}
          onSelect={onSelect}
          open
        />
      </AuraProvider>,
    );

    const search = await screen.findByRole("searchbox", { name: "Search commands" });
    await user.type(search, "media");
    expect(
      screen.queryByRole("option", { name: /AI Playground/u }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: /Media library/u }));
    expect(onSelect).toHaveBeenCalledWith(paletteItems[2]);
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe("settings patterns", () => {
  it("marks the active section and composes panels, groups, and rows", async () => {
    const user = userEvent.setup();
    const Harness = () => {
      const [value, setValue] = useState("profile");
      return (
        <SettingsLayout
          items={[
            { icon: Settings, label: "Profile", value: "profile" },
            { icon: Brain, label: "AI preferences", value: "ai" },
          ]}
          onValueChange={setValue}
          value={value}
        >
          <SettingsPanel description="Manage account details" title="Profile settings">
            <SettingsGroup description="Used across Aura" title="Identity">
              <SettingsRow
                action={<button type="button">Edit</button>}
                description="Your visible name"
                label="Name"
              />
            </SettingsGroup>
          </SettingsPanel>
        </SettingsLayout>
      );
    };
    render(<Harness />);

    expect(screen.getByRole("button", { name: "Profile" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.click(screen.getByRole("button", { name: "AI preferences" }));
    expect(screen.getByRole("button", { name: "AI preferences" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("heading", { name: "Profile settings" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Identity" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
