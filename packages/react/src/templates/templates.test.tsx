import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Settings } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import {
  AuthTemplate,
  ConversationTemplate,
  DashboardTemplate,
  EditorTemplate,
  MediaStudioTemplate,
  SettingsTemplate,
} from "./templates";

describe("templates", () => {
  it("builds a branded authentication page with form and footer slots", () => {
    render(
      <AuthTemplate
        brand="verbaura"
        brandDescription="Natural writing with control"
        brandTitle="VerbAura"
        description="Use your company account"
        footer={<small>PRAABINDH CORP</small>}
        title="Sign in"
      >
        <form>
          <label>
            Email <input type="email" />
          </label>
        </form>
      </AuthTemplate>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "VerbAura" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "VerbAura" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Sign in" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByText("PRAABINDH CORP")).toBeInTheDocument();
  });

  it("smoke-renders dashboard and settings compositions", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <DashboardTemplate
        aside={<p>Recent work</p>}
        header={{ description: "Usage across the month", title: "Usage insights" }}
      >
        <p>Dashboard content</p>
      </DashboardTemplate>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Usage insights" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Recent work").closest("aside")).toBeInTheDocument();

    rerender(
      <SettingsTemplate
        header={{ title: "Settings" }}
        items={[{ icon: Settings, label: "Profile", value: "profile" }]}
        onValueChange={onValueChange}
        value="profile"
      >
        <p>Settings content</p>
      </SettingsTemplate>,
    );
    await user.click(screen.getByRole("button", { name: "Profile" }));
    expect(onValueChange).toHaveBeenCalledWith("profile");
    expect(screen.getByText("Settings content")).toBeInTheDocument();
  });

  it("smoke-renders conversation, editor, and media studio templates", () => {
    const { rerender } = render(
      <ConversationTemplate body="Messages" composer="Composer" />,
    );
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Composer")).toBeInTheDocument();

    rerender(
      <EditorTemplate
        footer="Status"
        primary="Original"
        secondary="Result"
        toolbar="Formatting"
      />,
    );
    expect(screen.getByRole("region", { name: "Editor workspace" })).toHaveTextContent(
      "OriginalResult",
    );
    expect(screen.getByText("Formatting").tagName).toBe("HEADER");
    expect(screen.getByText("Status").tagName).toBe("FOOTER");

    rerender(
      <MediaStudioTemplate
        controls="Controls"
        preview="Preview"
        references="References"
      />,
    );
    expect(screen.getByRole("region", { name: "Media studio" })).toHaveTextContent(
      "ControlsPreview",
    );
    expect(screen.getByText("References")).toBeInTheDocument();
  });
});
