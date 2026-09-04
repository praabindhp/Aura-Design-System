import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Checkbox,
  Field,
  FileDropzone,
  Input,
  RadioGroup,
  SearchInput,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  Textarea,
} from "./forms";

describe("form controls", () => {
  it("associates field labels, descriptions, required cues, and errors", () => {
    const { rerender } = render(
      <Field
        description="Shown on your profile"
        htmlFor="display-name"
        label="Display name"
        required
      >
        <Input id="display-name" required />
      </Field>,
    );

    expect(screen.getByRole("textbox", { name: /Display name/u })).toBeRequired();
    expect(
      screen.getByRole("textbox", { name: /Display name/u }),
    ).toHaveAccessibleDescription("Shown on your profile");
    expect(screen.getByText("Shown on your profile")).toBeInTheDocument();

    rerender(
      <Field
        error="A display name is required"
        htmlFor="display-name"
        label="Display name"
      >
        <Input id="display-name" />
      </Field>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("A display name is required");
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "display-name-error",
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText("Shown on your profile")).not.toBeInTheDocument();
  });

  it("forwards refs and native input semantics", () => {
    const inputRef = createRef<HTMLInputElement>();
    const textareaRef = createRef<HTMLTextAreaElement>();
    render(
      <div>
        <Input ref={inputRef} aria-label="Title" />
        <Textarea ref={textareaRef} aria-label="Body" />
        <SearchInput aria-label="Search projects" />
        <Slider aria-label="Intensity" max={10} min={0} />
      </div>,
    );

    expect(inputRef.current).toBe(screen.getByRole("textbox", { name: "Title" }));
    expect(textareaRef.current).toBe(screen.getByRole("textbox", { name: "Body" }));
    expect(screen.getByRole("searchbox", { name: "Search projects" })).toHaveAttribute(
      "type",
      "search",
    );
    expect(screen.getByRole("slider", { name: "Intensity" })).toHaveAttribute(
      "max",
      "10",
    );
  });

  it("reports select, checkbox, radio, and switch changes", async () => {
    const user = userEvent.setup();
    const Harness = () => {
      const [format, setFormat] = useState("short");
      const [tone, setTone] = useState("professional");
      const [enabled, setEnabled] = useState(false);
      return (
        <div>
          <Select
            aria-label="Format"
            onValueChange={setFormat}
            options={[
              { label: "Short", value: "short" },
              { label: "Detailed", value: "detailed" },
            ]}
            value={format}
          />
          <Checkbox>Preserve formatting</Checkbox>
          <RadioGroup
            legend="Tone"
            name="tone"
            onValueChange={setTone}
            options={[
              { label: "Professional", value: "professional" },
              { label: "Friendly", value: "friendly" },
              { disabled: true, label: "Unavailable", value: "unavailable" },
            ]}
            value={tone}
          />
          <Switch
            checked={enabled}
            label="Email notifications"
            onCheckedChange={setEnabled}
          />
        </div>
      );
    };
    render(<Harness />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Format" }),
      "detailed",
    );
    expect(
      screen.getByRole<HTMLOptionElement>("option", { name: "Detailed" }).selected,
    ).toBe(true);

    await user.click(screen.getByRole("checkbox", { name: "Preserve formatting" }));
    expect(screen.getByRole("checkbox", { name: "Preserve formatting" })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: "Friendly" }));
    expect(screen.getByRole("radio", { name: "Friendly" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Unavailable" })).toBeDisabled();

    await user.click(screen.getByRole("switch", { name: "Email notifications" }));
    expect(screen.getByRole("switch", { name: "Email notifications" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("implements roving keyboard focus for segmented controls", async () => {
    const user = userEvent.setup();
    const Harness = () => {
      const [value, setValue] = useState("light");
      return (
        <SegmentedControl
          label="Rewrite strength"
          onValueChange={setValue}
          options={[
            { label: "Light", value: "light" },
            { disabled: true, label: "Balanced", value: "balanced" },
            { label: "Strong", value: "strong" },
          ]}
          value={value}
        />
      );
    };
    render(<Harness />);

    const light = screen.getByRole("radio", { name: "Light" });
    light.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Strong" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Strong" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    await user.keyboard("{ArrowRight}");
    expect(light).toHaveFocus();
    expect(light).toHaveAttribute("aria-checked", "true");
  });

  it("delivers accepted files and preserves disabled dropzones", async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    const { rerender } = render(
      <FileDropzone
        accept="image/*"
        description="PNG or JPEG"
        label="Upload reference"
        multiple
        onFiles={onFiles}
      />,
    );
    const input = screen.getByLabelText(/Upload reference/u);
    const image = new File(["image"], "reference.png", { type: "image/png" });
    await user.upload(input, image);
    expect(onFiles).toHaveBeenCalledWith([image]);
    expect(input).toHaveValue("");

    rerender(<FileDropzone disabled label="Upload reference" onFiles={onFiles} />);
    expect(screen.getByLabelText(/Upload reference/u)).toBeDisabled();
  });
});
