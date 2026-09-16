import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AuraProvider } from "../provider/AuraProvider";
import { DropdownSelect, type DropdownSelectHandle } from "./DropdownSelect";
import { Field } from "./forms";

const options = [
  { value: "private", label: "Only me" },
  { value: "team", label: "My team" },
  { value: "public", label: "Everyone", disabled: true },
];

describe("DropdownSelect", () => {
  it("labels the control, selects options, and submits the controlled value", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [value, setValue] = useState("private");
      return (
        <AuraProvider applyTo="scope">
          <form aria-label="Workspace">
            <Field
              htmlFor="visibility"
              label="Visibility"
              description="Who can access this workspace"
            >
              <DropdownSelect
                id="visibility"
                name="visibility"
                options={options}
                value={value}
                onValueChange={setValue}
              />
            </Field>
          </form>
        </AuraProvider>
      );
    }
    render(<Harness />);
    const control = screen.getByRole("combobox", { name: "Visibility" });
    expect(control).toHaveAccessibleDescription("Who can access this workspace");
    await user.click(control);
    expect(screen.getByRole("option", { name: "Everyone" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByRole("option", { name: "My team" }));
    expect(
      new FormData(screen.getByRole<HTMLFormElement>("form")).get("visibility"),
    ).toBe("team");
    expect(control).toHaveAttribute("aria-expanded", "false");
  });

  it("supports keyboard dismissal, focus refs, validation, and disabled controls", async () => {
    const ref = createRef<DropdownSelectHandle>();
    const onChange = vi.fn();
    const { rerender } = render(
      <AuraProvider applyTo="scope">
        <DropdownSelect
          aria-label="Format"
          aria-invalid="true"
          ref={ref}
          options={options}
          value="private"
          onValueChange={onChange}
        />
      </AuraProvider>,
    );
    act(() => ref.current?.focus());
    const control = screen.getByRole("combobox", { name: "Format" });
    expect(control).toHaveFocus();
    expect(control).toHaveAttribute("aria-invalid", "true");
    fireEvent.keyDown(control, { key: "ArrowDown", code: "ArrowDown", keyCode: 40 });
    expect(control).toHaveAttribute("aria-expanded", "true");
    await screen.findByRole("option", { name: "Only me" });
    fireEvent.keyDown(control, { key: "Escape", code: "Escape", keyCode: 27 });
    await waitFor(() => expect(control).toHaveAttribute("aria-expanded", "false"));
    expect(onChange).not.toHaveBeenCalled();
    act(() => ref.current?.blur());
    expect(control).not.toHaveFocus();
    rerender(
      <AuraProvider applyTo="scope">
        <DropdownSelect
          aria-label="Format"
          disabled
          name="format"
          options={options}
          value="private"
          onValueChange={onChange}
        />
      </AuraProvider>,
    );
    expect(screen.getByRole("combobox", { name: "Format" })).toBeDisabled();
  });
});
