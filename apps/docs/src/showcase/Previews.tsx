import { useId, useState } from "react";
import * as P from "@praabindh/aura-design-system";
import {
  ActivityChart,
  ChartGrid,
  ColumnChart,
  DonutChart,
  HorizontalBarChart,
  RadialChart,
} from "@praabindh/aura-charts";
import { RichMarkdown } from "@praabindh/aura-rich-content";
import {
  ArrowRight,
  Bell,
  Check,
  Command,
  FileText,
  Layers,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { ComponentName } from "./catalog";
import styles from "./showcase.module.css";

export const chartData = [
  { label: "Design", value: 42, tone: "brand" as const },
  { label: "Build", value: 32, tone: "info" as const },
  { label: "Review", value: 26, tone: "success" as const },
];
const options = [
  { label: "Design", value: "design" },
  { label: "Build", value: "build" },
  { label: "Ship", value: "ship" },
];
const commands = [
  {
    id: "new",
    label: "Create a workspace",
    description: "A fresh space for your next idea",
    icon: Plus,
  },
  {
    id: "search",
    label: "Find a document",
    description: "Pick up where you left off",
    icon: Search,
  },
  {
    id: "settings",
    label: "Open preferences",
    description: "Make yourself at home",
    icon: Settings,
  },
];

export function ActivityDemo() {
  return (
    <ActivityChart
      ariaLabel="Example weekly activity"
      points={[
        { label: "Mon", values: { work: 22, review: 12 } },
        { label: "Tue", values: { work: 38, review: 24 } },
        { label: "Wed", values: { work: 28, review: 18 } },
        { label: "Thu", values: { work: 54, review: 31 } },
        { label: "Fri", values: { work: 44, review: 29 } },
        { label: "Sat", values: { work: 68, review: 42 } },
        { label: "Sun", values: { work: 82, review: 55 } },
      ]}
      series={[
        { key: "work", label: "Created", tone: "brand" },
        { key: "review", label: "Reviewed", tone: "neutral", emphasis: "secondary" },
      ]}
    />
  );
}

export function PreferencesDemo() {
  const [notifications, setNotifications] = useState(true);
  const [digest, setDigest] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <P.Stack gap={5}>
      <P.Stack gap={2}>
        <P.Switch
          label="Notifications"
          checked={notifications}
          onCheckedChange={(value) => {
            setNotifications(value);
            setSaved(false);
          }}
        />
        <P.Text size="sm" tone="muted">
          Keep up with your workspace.
        </P.Text>
      </P.Stack>
      <P.Stack gap={2}>
        <P.Switch
          label="Weekly digest"
          checked={digest}
          onCheckedChange={(value) => {
            setDigest(value);
            setSaved(false);
          }}
        />
        <P.Text size="sm" tone="muted">
          A little perspective, every week.
        </P.Text>
      </P.Stack>
      <P.Button
        fullWidth
        variant="secondary"
        onClick={() => setSaved(true)}
        startIcon={saved ? <Check aria-hidden size={16} /> : undefined}
      >
        {saved ? "Preferences saved" : "Save preferences"}
      </P.Button>
      <P.VisuallyHidden>
        <span role="status">
          {saved ? "Example preferences saved for this visit." : ""}
        </span>
      </P.VisuallyHidden>
    </P.Stack>
  );
}

export function ProjectDemo() {
  const id = useId();
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
    >
      <P.Field label="Workspace name" htmlFor={`${id}-name`}>
        <P.Input
          id={`${id}-name`}
          placeholder="Something wonderful"
          required
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setDone(false);
          }}
        />
      </P.Field>
      <P.Field label="A few words about it" htmlFor={`${id}-brief`}>
        <P.Textarea
          id={`${id}-brief`}
          placeholder="Where does your next idea begin?"
          rows={2}
        />
      </P.Field>
      <P.Button type="submit" fullWidth endIcon={<ArrowRight aria-hidden size={16} />}>
        Create workspace
      </P.Button>
      {done && (
        <P.Alert
          tone="success"
          title={`${name} is ready`}
          description="This is a local demo. Your information stays in this page."
        />
      )}
    </form>
  );
}

export function ComposerDemo() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <form
      className={styles.composer}
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
        setMessage("");
      }}
    >
      <P.Textarea
        aria-label="Message"
        placeholder="What will you create today?"
        rows={3}
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
          setSent(false);
        }}
      />
      <div className={styles.between}>
        <P.Badge tone="neutral" icon={<Sparkles aria-hidden size={13} />}>
          A little inspiration
        </P.Badge>
        <P.IconButton
          label="Send message"
          variant="primary"
          type="submit"
          disabled={!message.trim()}
        >
          <ArrowRight aria-hidden size={17} />
        </P.IconButton>
      </div>
      {sent && (
        <P.Text role="status" size="sm">
          Message sent in this local demo.
        </P.Text>
      )}
    </form>
  );
}

export function StructurePreview({ name }: { name: ComponentName }) {
  return (
    <div
      className={styles.structure}
      role="img"
      aria-label={`${name} structure preview`}
    >
      <div className={styles.structureHeader}>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.structureBody} data-layout={name}>
        <div className={styles.structureSidebar}>
          <i />
          <i />
          <i />
        </div>
        <div className={styles.structureContent}>
          <div />
          <section>
            <span />
            <span />
            <span />
          </section>
          <div />
        </div>
      </div>
      <span className={styles.structureLabel}>
        Structure preview · open full example
      </span>
    </div>
  );
}

export function Preview({ name }: { name: ComponentName }) {
  const id = useId();
  const { brand } = P.useAura();
  const [choice, setChoice] = useState("design");
  const [checked, setChecked] = useState(true);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(64);
  const block = <div className={styles.layoutBlock}>Content</div>;
  switch (name) {
    case "Button":
      return (
        <P.Inline>
          <P.Button
            onClick={() => setNotice("Created")}
            startIcon={<Plus aria-hidden size={15} />}
          >
            {notice || "Create"}
          </P.Button>
          <P.Button variant="secondary" onClick={() => setNotice("")}>
            Reset
          </P.Button>
          <P.Button disabled>Disabled</P.Button>
        </P.Inline>
      );
    case "IconButton":
      return (
        <P.Inline>
          <P.IconButton
            label={checked ? "Turn notifications off" : "Turn notifications on"}
            aria-pressed={checked}
            onClick={() => setChecked(!checked)}
            variant={checked ? "primary" : "secondary"}
          >
            <Bell aria-hidden size={18} />
          </P.IconButton>
          <P.IconButton label="Add item" onClick={() => setNotice("Item added")}>
            <Plus aria-hidden size={18} />
          </P.IconButton>
          {notice && <P.Badge>{notice}</P.Badge>}
        </P.Inline>
      );
    case "LinkButton":
      return (
        <P.LinkButton href="#/start" endIcon={<ArrowRight aria-hidden size={16} />}>
          Start building
        </P.LinkButton>
      );
    case "Field":
      return (
        <P.Field
          htmlFor={id}
          label="Email address"
          description="Use your work email."
          error="Enter a complete email address."
        >
          <P.Input
            id={id}
            type="email"
            aria-invalid
            defaultValue="hello@"
            aria-describedby={`${id}-error`}
          />
        </P.Field>
      );
    case "Input":
      return (
        <P.Field htmlFor={id} label="Your next idea">
          <P.Input id={id} placeholder="Give it a name" />
        </P.Field>
      );
    case "SearchInput":
      return (
        <P.Field htmlFor={id} label="Search your workspace">
          <P.SearchInput id={id} placeholder="Find something good…" />
        </P.Field>
      );
    case "Textarea":
      return (
        <P.Field htmlFor={id} label="A little more detail">
          <P.Textarea id={id} placeholder="Start with a thought…" rows={3} />
        </P.Field>
      );
    case "Checkbox":
      return (
        <P.Stack gap={3}>
          <P.Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          >
            Keep me in the loop
          </P.Checkbox>
          <P.Checkbox disabled>Available after setup</P.Checkbox>
        </P.Stack>
      );
    case "Switch":
      return (
        <P.Switch label="Focus mode" checked={checked} onCheckedChange={setChecked} />
      );
    case "RadioGroup":
      return (
        <P.RadioGroup
          legend="Your workflow"
          name={id}
          options={options}
          value={choice}
          onValueChange={setChoice}
        />
      );
    case "DropdownSelect":
      return (
        <P.Field htmlFor={id} label="Workspace visibility">
          <P.DropdownSelect
            id={id}
            value={choice}
            onValueChange={setChoice}
            options={[
              { value: "design", label: "Only me" },
              { value: "build", label: "My team" },
              { value: "ship", label: "Everyone" },
            ]}
          />
        </P.Field>
      );
    case "Select":
      return (
        <P.Field htmlFor={id} label="Workspace stage">
          <P.Select
            id={id}
            options={options}
            value={choice}
            onValueChange={setChoice}
          />
        </P.Field>
      );
    case "SegmentedControl":
      return (
        <P.SegmentedControl
          label="Workflow stage"
          options={options}
          value={choice}
          onValueChange={setChoice}
        />
      );
    case "Slider":
      return (
        <P.Field htmlFor={id} label={`Intensity · ${value}%`}>
          <P.Slider
            id={id}
            min={0}
            max={100}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </P.Field>
      );
    case "FileDropzone":
      return (
        <P.FileDropzone
          label="Add a file"
          description={notice || "Choose a local text or Markdown file"}
          accept=".md,.txt"
          onFiles={(files) => setNotice(files[0]?.name ?? "No file selected")}
        />
      );
    case "Heading":
      return (
        <P.Stack gap={2}>
          <P.Heading level={3} size="lg">
            Make room for ideas.
          </P.Heading>
          <P.Heading level={4} size="sm">
            Give them a little structure.
          </P.Heading>
        </P.Stack>
      );
    case "Text":
      return (
        <P.Stack gap={2}>
          <P.Text size="lg">Thoughtfully expressed.</P.Text>
          <P.Text tone="secondary">A quieter supporting voice.</P.Text>
          <P.Text size="sm" tone="muted">
            Small details, considered.
          </P.Text>
        </P.Stack>
      );
    case "Code":
      return (
        <P.Text>
          Build with <P.Code>@praabindh/aura-design-system</P.Code>
        </P.Text>
      );
    case "Kbd":
      return (
        <P.Inline>
          <P.Kbd>⌘</P.Kbd>
          <P.Kbd>K</P.Kbd>
          <P.Text size="sm">Open commands</P.Text>
        </P.Inline>
      );
    case "Surface":
      return (
        <P.Surface padding="lg" elevation="raised">
          <P.Text>Space for something meaningful.</P.Text>
        </P.Surface>
      );
    case "Divider":
      return (
        <P.Stack gap={4}>
          <P.Text>One thought</P.Text>
          <P.Divider />
          <P.Text>Another perspective</P.Text>
        </P.Stack>
      );
    case "VisuallyHidden":
      return (
        <>
          <P.VisuallyHidden>Additional context for screen readers.</P.VisuallyHidden>
          <P.Text size="sm">
            The extra description is available to assistive technology.
          </P.Text>
        </>
      );
    case "Avatar":
      return (
        <P.Inline>
          <P.Avatar fallback="PA" size="lg" />
          <P.Avatar fallback="AK" />
          <P.Avatar fallback="JD" size="sm" />
        </P.Inline>
      );
    case "ProductMark":
      return (
        <P.Inline>
          {(["aura", "verbaura", "cognaura", "rendaura", "charteraura"] as const).map(
            (item) => (
              <P.ProductMark key={item} brand={item} size="sm" />
            ),
          )}
        </P.Inline>
      );
    case "Badge":
      return (
        <P.Inline gap={2}>
          <P.Badge tone="success" icon={<Check aria-hidden size={13} />}>
            Ready
          </P.Badge>
          <P.Badge tone="warning">In review</P.Badge>
          <P.Badge tone="danger">Needs attention</P.Badge>
        </P.Inline>
      );
    case "StatusBadge":
      return (
        <P.StatusBadge tone="success" icon={Check}>
          All systems ready
        </P.StatusBadge>
      );
    case "Progress":
      return (
        <P.Stack gap={3}>
          <P.Text size="sm">A little further · 64%</P.Text>
          <P.Progress label="Example completion" value={64} />
        </P.Stack>
      );
    case "Skeleton":
      return (
        <P.Stack gap={3}>
          <P.Skeleton label="Loading title" />
          <P.Skeleton label="Loading preview" variant="block" size="lg" />
        </P.Stack>
      );
    case "Spinner":
      return (
        <P.Inline>
          <P.Spinner label="Getting things ready" />
          <P.Text size="sm">Getting things ready</P.Text>
        </P.Inline>
      );
    case "Alert":
      return (
        <P.Alert
          tone="success"
          title="You're all set"
          description="Your changes have been saved."
        />
      );
    case "EmptyState":
      return (
        <P.EmptyState
          title="A fresh start"
          description="Your next idea belongs here."
          action={
            <P.Button size="sm" onClick={() => setNotice("Your first item is ready.")}>
              {notice || "Add your first item"}
            </P.Button>
          }
        />
      );
    case "ErrorState":
      return notice ? (
        <P.Alert tone="success" title="Connection restored" />
      ) : (
        <P.ErrorState
          title="Let's try that again"
          description="This example can recover from an error."
          onRetry={() => setNotice("Recovered")}
        />
      );
    case "LoadingState":
      return <P.LoadingState label="Gathering your workspace" />;
    case "Dialog":
      return (
        <>
          <P.Button onClick={() => setOpen(true)}>Open dialog</P.Button>
          <P.Dialog
            title="A space for your next idea"
            description="Focused content, with room to think."
            open={open}
            onClose={() => setOpen(false)}
            footer={<P.Button onClick={() => setOpen(false)}>Got it</P.Button>}
          >
            <P.Text>Press Escape or close this dialog to return to the example.</P.Text>
          </P.Dialog>
        </>
      );
    case "Drawer":
      return (
        <>
          <P.Button variant="secondary" onClick={() => setOpen(true)}>
            Open drawer
          </P.Button>
          <P.Drawer
            title="A little more context"
            open={open}
            onClose={() => setOpen(false)}
          >
            <P.Text>Supporting content stays close to the task at hand.</P.Text>
          </P.Drawer>
        </>
      );
    case "Confirm":
      return (
        <P.Stack gap={3}>
          <P.Confirm
            title="Remove the example?"
            description="This only changes the local demo."
            tone="danger"
            confirmLabel="Remove example"
            onConfirm={() => setNotice("Example removed")}
          >
            <P.Button variant="danger" startIcon={<Trash2 aria-hidden size={15} />}>
              Remove example
            </P.Button>
          </P.Confirm>
          {notice && <P.Text role="status">{notice}</P.Text>}
        </P.Stack>
      );
    case "Tooltip":
      return (
        <P.Tooltip content="Your notifications">
          <P.IconButton label="Your notifications">
            <Bell aria-hidden size={18} />
          </P.IconButton>
        </P.Tooltip>
      );
    case "Breadcrumbs":
      return (
        <P.Breadcrumbs
          items={[
            { label: "PADS", href: "#/" },
            { label: "Components", href: "#/components" },
            { label: "Navigation" },
          ]}
        />
      );
    case "Tabs":
      return (
        <P.Tabs
          ariaLabel="Example information"
          value={choice}
          onValueChange={setChoice}
          items={options.map((option) => ({
            ...option,
            content: (
              <P.Text size="sm">
                {option.label === "Design"
                  ? "Begin with a clear purpose."
                  : option.label === "Build"
                    ? "Bring the pieces together."
                    : "Share something thoughtful."}
              </P.Text>
            ),
          }))}
        />
      );
    case "Pagination":
      return (
        <P.Pagination current={page} pageSize={10} total={30} onChange={setPage} />
      );
    case "SkipLink":
      return (
        <>
          <P.SkipLink href="#showcase-main">Skip to page content</P.SkipLink>
          <P.Text size="sm">Use Tab to reveal the skip link.</P.Text>
        </>
      );
    case "DataTable":
      return (
        <P.DataTable
          caption="Example workspace"
          getRowKey={(row) => row.name}
          rows={[
            { name: "Brand direction", status: "Ready" },
            { name: "Component kit", status: "In review" },
          ]}
          columns={[
            { key: "name", header: "Project", cell: (row) => row.name },
            {
              key: "status",
              header: "Status",
              cell: (row) => (
                <P.Badge tone={row.status === "Ready" ? "success" : "warning"}>
                  {row.status}
                </P.Badge>
              ),
            },
          ]}
        />
      );
    case "DescriptionList":
      return (
        <P.DescriptionList
          items={[
            { label: "Workspace", value: "A place for ideas" },
            { label: "Visibility", value: "Just your team" },
          ]}
        />
      );
    case "Stat":
      return (
        <P.Stat
          label="Ideas brought to life"
          value="1,284"
          hint="A little progress, every day"
        />
      );
    case "ActionCard":
      return (
        <P.ActionCard
          icon={Sparkles}
          title="Start something new"
          description={notice || "A blank canvas, full of possibility"}
          onClick={() => setNotice("Your canvas is ready")}
        />
      );
    case "MetricCard":
      return (
        <P.MetricCard
          icon={Layers}
          label="Projects created"
          value="128"
          hint="12 more than last month"
          hintTone="success"
        />
      );
    case "UsageCard":
      return <P.UsageCard current={640} max={1000} unit="credits" />;
    case "Section":
      return (
        <P.Section title="Your workspace" description="Everything in its place">
          {block}
        </P.Section>
      );
    case "CardGrid":
      return (
        <P.CardGrid columns={2}>
          <P.Surface>First idea</P.Surface>
          <P.Surface>Next idea</P.Surface>
        </P.CardGrid>
      );
    case "CommandPalette":
      return (
        <>
          <P.Button
            variant="secondary"
            startIcon={<Command aria-hidden size={16} />}
            onClick={() => setOpen(true)}
          >
            Open commands
          </P.Button>
          <P.CommandPalette
            open={open}
            onClose={() => setOpen(false)}
            items={commands}
            onSelect={(item) => setNotice(`${item.label} selected`)}
          />
          {notice && <P.Text role="status">{notice}</P.Text>}
        </>
      );
    case "ContextPalette":
      return (
        <P.Stack gap={2}>
          <P.ContextPalette
            label="Example actions"
            items={commands}
            onSelect={(item) => setNotice(`${item.label} selected`)}
          />
          {notice && <P.Text role="status">{notice}</P.Text>}
        </P.Stack>
      );
    case "ContextAction":
      return (
        <P.Inline>
          <P.Text>Open workspace</P.Text>
          <P.ContextAction label="Open workspace" />
        </P.Inline>
      );
    case "ComposerDock":
      return (
        <P.ComposerDock
          brand={brand}
          name="Aura"
          label="Example composer"
          collapsedLabel="Expand example composer"
          editor={
            <P.Textarea aria-label="Your message" placeholder="Begin a conversation" />
          }
          action={<P.Button type="submit">Send</P.Button>}
          onSubmit={(event) => {
            event.preventDefault();
            setNotice("Message sent");
          }}
          controls={<P.Text size="sm">{notice || "Local example"}</P.Text>}
        />
      );
    case "SettingsRow":
      return (
        <P.SettingsRow
          label="Focus mode"
          description="Make room for your work"
          action={
            <P.Switch
              label="Focus mode"
              checked={checked}
              onCheckedChange={setChecked}
            />
          }
        />
      );
    case "SettingsGroup":
      return (
        <P.SettingsGroup
          title="Make it yours"
          description="Small choices, a better workspace"
        >
          <P.Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          >
            Show helpful tips
          </P.Checkbox>
        </P.SettingsGroup>
      );
    case "SettingsPanel":
      return (
        <P.SettingsPanel title="Preferences">
          <P.Switch
            label="Show helpful tips"
            checked={checked}
            onCheckedChange={setChecked}
          />
        </P.SettingsPanel>
      );
    case "SettingsLayout":
      return (
        <P.SettingsLayout
          items={[
            { value: "design", label: "General", icon: Settings },
            { value: "build", label: "Notifications", icon: Bell },
          ]}
          value={choice}
          onValueChange={setChoice}
        >
          <P.Text>
            {choice === "design"
              ? "Your workspace preferences"
              : "Your notification preferences"}
          </P.Text>
        </P.SettingsLayout>
      );
    case "MediaPreview":
      return (
        <P.MediaPreview
          alt="Example media placeholder"
          ratio="landscape"
          fallback={<Sparkles aria-hidden size={32} />}
        />
      );
    case "MediaCard":
      return (
        <P.MediaCard
          title="A new perspective"
          metadata={<P.Badge>Concept</P.Badge>}
          preview={<P.MediaPreview alt="Concept placeholder" ratio="landscape" />}
        />
      );
    case "MediaGrid":
      return (
        <P.MediaGrid>
          <P.MediaPreview alt="First asset placeholder" />
          <P.MediaPreview alt="Second asset placeholder" />
        </P.MediaGrid>
      );
    case "ReferenceCard":
      return (
        <P.ReferenceCard
          title="A reference worth keeping"
          description="Inspiration · Text document"
          preview={<FileText aria-hidden size={22} />}
        />
      );
    case "AuraProvider":
      return (
        <P.AuraProvider
          applyTo="scope"
          storageKey={null}
          brand="cognaura"
          defaultTheme="light"
        >
          <P.Surface>
            <P.Button>Scoped CognAura theme</P.Button>
          </P.Surface>
        </P.AuraProvider>
      );
    case "ThemeToggle":
      return <P.ThemeToggle />;
    case "Box":
      return <P.Box>{block}</P.Box>;
    case "Stack":
      return (
        <P.Stack gap={2}>
          {block}
          {block}
        </P.Stack>
      );
    case "Inline":
      return (
        <P.Inline>
          <P.Badge>One</P.Badge>
          <P.Badge tone="neutral">Two</P.Badge>
          <P.Badge tone="info">Three</P.Badge>
        </P.Inline>
      );
    case "Grid":
      return (
        <P.Grid columns={2} collapse={false}>
          {block}
          {block}
        </P.Grid>
      );
    case "Container":
      return <P.Container size="sm">{block}</P.Container>;
    case "PageLayout":
      return <P.PageLayout width="full">{block}</P.PageLayout>;
    case "SplitPane":
      return <P.SplitPane primary={block} secondary={block} />;
    case "DashboardLayout":
      return <P.DashboardLayout main={block} aside={block} />;
    case "TopBar":
      return (
        <P.TopBar
          leading={<P.ProductMark brand={brand} size="sm" />}
          actions={<P.Avatar fallback="PA" size="sm" />}
        />
      );
    case "ActivityChart":
      return <ActivityDemo />;
    case "ColumnChart":
      return <ColumnChart ariaLabel="Example stages" data={chartData} />;
    case "DonutChart":
      return (
        <DonutChart
          ariaLabel="Example project mix"
          data={chartData}
          centerValue="100"
          centerLabel="projects"
        />
      );
    case "RadialChart":
      return (
        <RadialChart ariaLabel="Example monthly capacity" value={72} label="complete" />
      );
    case "HorizontalBarChart":
      return (
        <HorizontalBarChart ariaLabel="Example stage comparison" data={chartData} />
      );
    case "ChartGrid":
      return (
        <ChartGrid>
          <RadialChart ariaLabel="First example capacity" value={72} />
          <RadialChart ariaLabel="Second example capacity" value={48} />
        </ChartGrid>
      );
    case "RichMarkdown":
      return (
        <RichMarkdown>
          {
            "### Ideas deserve good typography.\n\nA little **emphasis**, a useful [link](#/start), and space for your next thought."
          }
        </RichMarkdown>
      );
    // Full-page landmarks and templates open in an isolated Storybook canvas.
    default:
      return <StructurePreview name={name} />;
  }
}
