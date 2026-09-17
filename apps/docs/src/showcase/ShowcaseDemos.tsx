import { useId, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Field,
  IconButton,
  Input,
  Stack,
  Switch,
  Text,
  Textarea,
  VisuallyHidden,
} from "@praabindh/aura-design-system";
import { ActivityChart } from "@praabindh/aura-charts";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import styles from "./showcase.module.css";

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
        {
          key: "review",
          label: "Reviewed",
          tone: "neutral",
          emphasis: "secondary",
        },
      ]}
    />
  );
}

export function PreferencesDemo() {
  const [notifications, setNotifications] = useState(true);
  const [digest, setDigest] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap={5}>
      <Stack gap={2}>
        <Switch
          label="Notifications"
          checked={notifications}
          onCheckedChange={(value) => {
            setNotifications(value);
            setSaved(false);
          }}
        />
        <Text size="sm" tone="muted">
          Keep up with your workspace.
        </Text>
      </Stack>
      <Stack gap={2}>
        <Switch
          label="Weekly digest"
          checked={digest}
          onCheckedChange={(value) => {
            setDigest(value);
            setSaved(false);
          }}
        />
        <Text size="sm" tone="muted">
          A little perspective, every week.
        </Text>
      </Stack>
      <Button
        fullWidth
        variant="secondary"
        onClick={() => setSaved(true)}
        startIcon={saved ? <Check aria-hidden size={16} /> : undefined}
      >
        {saved ? "Preferences saved" : "Save preferences"}
      </Button>
      <VisuallyHidden>
        <span role="status">
          {saved ? "Example preferences saved for this visit." : ""}
        </span>
      </VisuallyHidden>
    </Stack>
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
      <Field label="Workspace name" htmlFor={`${id}-name`}>
        <Input
          id={`${id}-name`}
          placeholder="Something wonderful"
          required
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setDone(false);
          }}
        />
      </Field>
      <Field label="A few words about it" htmlFor={`${id}-brief`}>
        <Textarea
          id={`${id}-brief`}
          placeholder="Where does your next idea begin?"
          rows={2}
        />
      </Field>
      <Button type="submit" fullWidth endIcon={<ArrowRight aria-hidden size={16} />}>
        Create workspace
      </Button>
      {done ? (
        <Alert
          tone="success"
          title={`${name} is ready`}
          description="This is a local demo. Your information stays in this page."
        />
      ) : null}
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
      <Textarea
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
        <Badge tone="neutral" icon={<Sparkles aria-hidden size={13} />}>
          A little inspiration
        </Badge>
        <IconButton
          label="Send message"
          variant="primary"
          type="submit"
          disabled={!message.trim()}
        >
          <ArrowRight aria-hidden size={17} />
        </IconButton>
      </div>
      {sent ? (
        <Text role="status" size="sm">
          Message sent in this local demo.
        </Text>
      ) : null}
    </form>
  );
}
