import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Code,
  Container,
  Divider,
  Grid,
  Heading,
  IconButton,
  Inline,
  Kbd,
  LinkButton,
  ProductMark,
  Progress,
  Skeleton,
  Spinner,
  Stack,
  Surface,
  Text,
  VisuallyHidden,
} from "./index";

describe("semantic primitives", () => {
  it("preserves native heading, text, code, keyboard, and separator semantics", () => {
    render(
      <div>
        <Heading level={3} size="lg">
          Foundation
        </Heading>
        <Text as="span" data-testid="text" size="sm" tone="muted">
          Description
        </Text>
        <Code>const value = true</Code>
        <Kbd>⌘K</Kbd>
        <Divider />
        <VisuallyHidden>Screen reader detail</VisuallyHidden>
      </div>,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Foundation" }),
    ).toHaveAttribute("data-size", "lg");
    expect(screen.getByTestId("text").tagName).toBe("SPAN");
    expect(screen.getByTestId("text")).toHaveAttribute("data-tone", "muted");
    expect(screen.getByText("const value = true").tagName).toBe("CODE");
    expect(screen.getByText("⌘K").tagName).toBe("KBD");
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(screen.getByText("Screen reader detail")).toBeInTheDocument();
  });

  it("forwards layout attributes and exposes responsive configuration as data", () => {
    render(
      <Container size="xl">
        <Grid aria-label="Results" collapse={false} columns={4} gap={8}>
          <Box data-testid="box">One</Box>
          <Stack data-testid="stack" gap={5}>
            <span>Two</span>
          </Stack>
          <Inline data-testid="inline" gap={2}>
            <span>Three</span>
          </Inline>
        </Grid>
        <Surface data-testid="surface" elevation="raised" interactive padding="lg" />
      </Container>,
    );

    expect(screen.getByLabelText("Results")).toHaveAttribute("data-collapse", "false");
    expect(screen.getByLabelText("Results")).toHaveTextContent("OneTwoThree");
    expect(screen.getByTestId("box")).toHaveTextContent("One");
    expect(screen.getByTestId("stack")).toHaveTextContent("Two");
    expect(screen.getByTestId("inline")).toHaveTextContent("Three");
    expect(screen.getByTestId("surface")).toHaveAttribute("data-elevation", "raised");
    expect(screen.getByTestId("surface")).toHaveAttribute("data-interactive", "true");
    expect(screen.getByTestId("surface")).toHaveAttribute("data-padding", "lg");
  });
});

describe("controls", () => {
  it("keeps buttons keyboard operable and loading buttons unavailable", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <div>
        <Button onClick={onClick} startIcon={<span aria-hidden>+</span>}>
          Create
        </Button>
        <Button loading onClick={onClick}>
          Saving
        </Button>
        <IconButton loading label="Refreshing" onClick={onClick}>
          <span aria-hidden>↻</span>
        </IconButton>
      </div>,
    );

    const create = screen.getByRole("button", { name: "Create" });
    create.focus();
    expect(create).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    const saving = screen.getByRole("button", { name: "Saving" });
    expect(saving).toBeDisabled();
    expect(saving).toHaveAttribute("aria-busy", "true");
    await user.click(saving);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Refreshing" })).toBeDisabled();
  });

  it("provides names for icon controls, links, and progress indicators", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <div>
        <IconButton label="Open menu" onClick={onClick}>
          <span aria-hidden>☰</span>
        </IconButton>
        <LinkButton href="/documents" endIcon={<span aria-hidden>→</span>}>
          Documents
        </LinkButton>
        <Spinner label="Generating image" />
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Documents" })).toHaveAttribute(
      "href",
      "/documents",
    );
    expect(
      screen.getByRole("status", { name: "Generating image" }),
    ).toBeInTheDocument();
  });
});

describe("identity and status", () => {
  const identities = [
    ["aura", "Aura", "A"],
    ["verbaura", "VerbAura", "V"],
    ["cognaura", "CognAura", "C"],
    ["rendaura", "RendAura", "R"],
    ["charteraura", "CharterAura", "C"],
    ["charteraura-intermediate", "CharterAura Intermediate", "C"],
  ] as const;

  it.each(identities)("renders the %s product identity", (brand, name, letter) => {
    render(<ProductMark brand={brand} size="lg" />);
    const mark = screen.getByRole("img", { name });
    expect(mark).toHaveAttribute("data-brand", brand);
    expect(mark).toHaveAttribute("data-size", "lg");
    expect(mark).toHaveTextContent(letter);
  });

  it("supports decorative marks and accessible avatar alternatives", () => {
    const { rerender } = render(<ProductMark brand="verbaura" decorative />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    rerender(<Avatar alt="Praabindh P" fallback="PP" src="/avatar.png" size="sm" />);
    expect(screen.getByRole("img", { name: "Praabindh P" })).toHaveAttribute(
      "src",
      "/avatar.png",
    );

    rerender(<Avatar fallback="PP" />);
    expect(screen.getByText("PP")).toBeInTheDocument();
  });

  it("pairs visible status text with semantic progress and loading states", () => {
    render(
      <div>
        <Badge tone="warning">Storage nearly full</Badge>
        <Progress label="Monthly usage" max={100} value={140} />
        <Skeleton label="Loading activity" size="lg" variant="block" />
      </div>,
    );

    expect(screen.getByText("Storage nearly full")).toHaveAttribute(
      "data-tone",
      "warning",
    );
    const progress = screen.getByRole("progressbar", { name: "Monthly usage" });
    expect(progress).toHaveAttribute("value", "100");
    expect(screen.getByRole("status", { name: "Loading activity" })).toHaveAttribute(
      "data-variant",
      "block",
    );
  });
});
