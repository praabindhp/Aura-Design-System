import {
  Button,
  Checkbox,
  Field,
  FileDropzone,
  Input,
  RadioGroup,
  SearchInput,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@praabindh/aura-design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";
import { StoryIntro, StoryPage } from "./StoryPage";

const meta: Meta = {
  title: "Forms/Fields and choices",
  parameters: {
    docs: {
      description: {
        component:
          "Form primitives preserve native semantics, visible labels, associated guidance, validation, and keyboard behavior.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const toneOptions = [
  { label: "Professional", value: "professional" },
  { label: "Conversational", value: "conversational" },
  { label: "Concise", value: "concise" },
] as const;

const intensityOptions = [
  { label: "Light", value: "light" },
  { label: "Balanced", value: "balanced" },
  { label: "Strong", value: "strong" },
] as const;

export const CompleteForm: Story = {
  render: function Render() {
    const [tone, setTone] =
      useState<(typeof toneOptions)[number]["value"]>("professional");
    const [intensity, setIntensity] =
      useState<(typeof intensityOptions)[number]["value"]>("balanced");
    const [delivery, setDelivery] = useState("email");
    const [preserve, setPreserve] = useState(true);

    return (
      <StoryPage>
        <StoryIntro
          eyebrow="Forms · Complete state"
          title="Useful defaults with explicit guidance"
          description="Every persistent control keeps a visible label. Errors are actionable, choices work without a pointer, and disabled states remain intentional."
        />
        <form className="docsForm" onSubmit={(event) => event.preventDefault()}>
          <Field
            description="Use a name people will recognize in navigation."
            htmlFor="project-name"
            label="Project name"
            required
          >
            <Input
              id="project-name"
              name="projectName"
              placeholder="Research workspace"
              required
            />
          </Field>
          <Field htmlFor="brief" label="Brief">
            <Textarea
              id="brief"
              name="brief"
              placeholder="Describe the intended outcome"
              rows={4}
            />
          </Field>
          <Field
            htmlFor="email"
            label="Notification email"
            error="Enter a complete email address."
          >
            <Input
              aria-describedby="email-error"
              aria-invalid="true"
              id="email"
              name="email"
              defaultValue="praabindh@"
              type="email"
            />
          </Field>
          <Field htmlFor="tone" label="Tone">
            <Select
              id="tone"
              options={toneOptions}
              value={tone}
              onValueChange={setTone}
            />
          </Field>
          <div className="docsSection">
            <Text as="div" size="sm" tone="secondary">
              Intensity
            </Text>
            <SegmentedControl
              label="Intensity"
              options={intensityOptions}
              value={intensity}
              onValueChange={setIntensity}
            />
          </div>
          <RadioGroup
            legend="Delivery"
            name="delivery"
            options={[
              { label: "Email summary", value: "email" },
              { label: "In-product only", value: "product" },
            ]}
            value={delivery}
            onValueChange={setDelivery}
          />
          <Stack gap={3}>
            <Checkbox
              checked={preserve}
              onChange={(event) => setPreserve(event.target.checked)}
            >
              Preserve formatting
            </Checkbox>
            <Switch
              checked={preserve}
              label="Preserve meaning"
              onCheckedChange={setPreserve}
            />
          </Stack>
          <Field htmlFor="creativity" label="Creativity">
            <Slider
              aria-label="Creativity"
              id="creativity"
              min={0}
              max={100}
              defaultValue={48}
            />
          </Field>
          <FileDropzone
            accept=".md,.txt"
            label="Add source files"
            description="Markdown or plain text, up to the product limit"
            onFiles={() => undefined}
          />
          <Button type="submit">Create project</Button>
        </form>
      </StoryPage>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole("textbox", { name: "Project name" });
    await userEvent.type(name, " PADS");
    await expect(name).toHaveValue(" PADS");
  },
};

export const SearchAndDisabled: Story = {
  render: () => (
    <StoryPage>
      <StoryIntro
        eyebrow="Forms · Compact controls"
        title="Search and unavailable states"
        description="Search keeps its native input semantics, while disabled controls communicate that an action is currently unavailable."
      />
      <div className="docsForm">
        <Field htmlFor="search" label="Search components">
          <SearchInput id="search" placeholder="Button, dialog, chart…" />
        </Field>
        <Switch
          checked={false}
          disabled
          label="Automatic publishing"
          onCheckedChange={() => undefined}
        />
        <Button disabled>Publish packages</Button>
      </div>
    </StoryPage>
  ),
};
