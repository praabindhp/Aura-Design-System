import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AuraProvider } from "../provider";
import {
  Alert,
  Confirm,
  Dialog,
  Drawer,
  EmptyState,
  ErrorState,
  Loader,
  LoadingState,
  Tooltip,
  useAuraFeedback,
} from "./feedback";

const withProvider = (node: ReactNode) =>
  render(
    <AuraProvider applyTo="scope" defaultTheme="light" storageKey={null}>
      {node}
    </AuraProvider>,
  );

const getComputedStyle = window.getComputedStyle.bind(window);

beforeAll(() => {
  vi.spyOn(window, "getComputedStyle").mockImplementation((element) =>
    getComputedStyle(element),
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("feedback", () => {
  it("uses assertive semantics for danger and dismisses from a named control", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(
      <Alert
        description="Please try again"
        onDismiss={onDismiss}
        title="Upload failed"
        tone="danger"
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Upload failed");
    expect(alert).toHaveTextContent("Please try again");
    await user.click(
      within(alert).getByRole("button", { name: "Dismiss notification" }),
    );
    expect(onDismiss).toHaveBeenCalledOnce();

    rerender(<Alert title="Saved" tone="success" />);
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("renders empty, error, retry, and loading states with visible text", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(
      <EmptyState
        action={<a href="/new">Create one</a>}
        description="Start a new document"
        title="No documents"
      />,
    );
    expect(screen.getByRole("heading", { name: "No documents" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create one" })).toHaveAttribute(
      "href",
      "/new",
    );

    rerender(
      <ErrorState description="The service did not respond" onRetry={onRetry} />,
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();

    rerender(<LoadingState label="Loading documents" />);
    expect(screen.getByText("Loading documents")).toBeInTheDocument();
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("describes branded content loading without relying on motion", () => {
    render(
      <Loader
        label="Preparing your workspace"
        description="Bringing components into focus"
        size="lg"
      />,
    );
    const loader = screen.getByRole("status", {
      name: "Preparing your workspace",
    });
    expect(loader).toHaveAttribute("aria-busy", "true");
    expect(loader).toHaveTextContent("Preparing your workspace");
    expect(loader).toHaveTextContent("Bringing components into focus");
  });

  it("opens an accessible dialog and closes it from the Ant close control", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    withProvider(
      <Dialog
        description="This cannot be undone."
        onClose={onClose}
        open
        title="Delete document"
        width="sm"
      >
        <p>Document details</p>
      </Dialog>,
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Delete document");
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    expect(within(dialog).getByText("This cannot be undone.")).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Document details");
    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("opens and closes a named navigation drawer", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    withProvider(
      <Drawer onClose={onClose} open placement="left" title="Navigation">
        <a href="/dashboard">Dashboard</a>
      </Drawer>,
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Navigation");
    expect(within(dialog).getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("reveals tooltip content and opens confirmations from the keyboard", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    withProvider(
      <div>
        <Tooltip content="Refresh activity">
          <button type="button">Refresh</button>
        </Tooltip>
        <Confirm
          description="The draft will be removed"
          onConfirm={onConfirm}
          title="Delete draft"
          tone="danger"
        >
          <button type="button">Delete</button>
        </Confirm>
      </div>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "Refresh" })).toHaveFocus();
    expect(await screen.findByText("Refresh activity")).toBeInTheDocument();

    screen.getByRole("button", { name: "Delete" }).focus();
    expect(screen.getByRole("button", { name: "Delete" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Delete draft")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("exposes all feedback channels through the provider hook", async () => {
    const user = userEvent.setup();
    function FeedbackHarness() {
      const feedback = useAuraFeedback();
      return (
        <div>
          <button type="button" onClick={() => feedback.info("Information")}>
            Info
          </button>
          <button type="button" onClick={() => feedback.success("Success")}>
            Success
          </button>
          <button type="button" onClick={() => feedback.warning("Warning")}>
            Warning
          </button>
          <button type="button" onClick={() => feedback.error("Error")}>
            Error
          </button>
        </div>
      );
    }
    withProvider(<FeedbackHarness />);

    for (const label of ["Info", "Success", "Warning", "Error"]) {
      await user.click(screen.getByRole("button", { name: label }));
    }
    expect(await screen.findByText("Information")).toBeInTheDocument();
    expect((await screen.findAllByText("Success")).length).toBeGreaterThan(1);
    expect((await screen.findAllByText("Warning")).length).toBeGreaterThan(1);
    expect((await screen.findAllByText("Error")).length).toBeGreaterThan(1);
  });
});
