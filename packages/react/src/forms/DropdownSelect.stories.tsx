import {
  DropdownSelect,
  Field,
  Input,
  SearchInput,
  Select,
  Stack,
  Surface,
  Text,
  Textarea,
} from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta = {
  title: "Forms/Styled dropdowns",
  parameters: {
    docs: {
      description: {
        component:
          "DropdownSelect is a controlled, single-choice form primitive. Use a visible Field label, short option labels, and an actionable validation message. Arrow keys navigate, Enter selects, Escape cancels, and Tab moves onward. Selected options have a checkmark; disabled choices remain unavailable. Use native Select when browser-native menus or built-in form validation are needed. Both retain a single, visible focus boundary.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
const options = [
  { value: "private", label: "Only me" },
  { value: "team", label: "My team" },
  { value: "public", label: "Everyone", disabled: true },
];

export const WorkspaceVisibility: Story = {
  render: function Render() {
    const [value, setValue] = useState("private");
    return (
      <Surface padding="lg">
        <Stack gap={5}>
          <Text>Styled choices for workspace settings and appearance preferences.</Text>
          <Field
            htmlFor="dropdown-visibility"
            label="Workspace visibility"
            description="Choose who can access this workspace."
          >
            <DropdownSelect
              id="dropdown-visibility"
              name="visibility"
              options={options}
              value={value}
              onValueChange={setValue}
            />
          </Field>
          <Field htmlFor="dropdown-disabled" label="Locked visibility">
            <DropdownSelect
              id="dropdown-disabled"
              disabled
              options={options}
              value="private"
              onValueChange={() => undefined}
            />
          </Field>
          <Field
            htmlFor="dropdown-error"
            label="Review visibility"
            error="Choose the audience permitted for this workspace."
          >
            <DropdownSelect
              id="dropdown-error"
              options={options}
              value={value}
              onValueChange={setValue}
            />
          </Field>
        </Stack>
      </Surface>
    );
  },
};

export const SingleBoundaryFocus: Story = {
  render: () => (
    <Surface padding="lg">
      <Stack gap={5}>
        <Text>
          Click or Tab through these controls. Focus follows one inset border without a
          second ring or halo.
        </Text>
        <Field htmlFor="focus-input" label="Project name">
          <Input id="focus-input" placeholder="A new idea" />
        </Field>
        <Field htmlFor="focus-search" label="Search projects">
          <SearchInput id="focus-search" />
        </Field>
        <Field htmlFor="focus-textarea" label="Description">
          <Textarea id="focus-textarea" />
        </Field>
        <Field htmlFor="focus-select" label="Native selection">
          <Select
            id="focus-select"
            options={options}
            value="private"
            onValueChange={() => undefined}
          />
        </Field>
        <Field htmlFor="focus-readonly" label="Read-only name">
          <Input id="focus-readonly" readOnly value="Existing workspace" />
        </Field>
        <Field htmlFor="focus-disabled" label="Unavailable name">
          <Input id="focus-disabled" disabled value="Unavailable" />
        </Field>
        <Field htmlFor="focus-error" label="Invalid name" error="Enter a project name.">
          <Input id="focus-error" />
        </Field>
      </Stack>
    </Surface>
  ),
};
