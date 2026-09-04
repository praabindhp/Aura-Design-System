# Content design

PADS components shape how products communicate. Their default labels, errors,
empty states, and documentation should be concise, calm, actionable, and
inclusive.

## Voice

Aura interfaces are professional and direct without sounding mechanical.

- Lead with what happened or what the user can do.
- Use familiar words and short sentences.
- Prefer active voice.
- Do not blame the user.
- Avoid hype, jokes in failure states, and unnecessary urgency.
- Explain technical detail only when it helps recovery or a decision.

## Labels and actions

- Use sentence case: `Create document`, not `Create Document`.
- Start buttons with a specific verb: `Save changes`, `Import file`, `Try again`.
- Avoid ambiguous actions such as `OK`, `Submit`, or `Yes` when a precise verb is
  available.
- Keep paired actions distinct: `Discard draft` and `Keep editing`.
- Use the same term for the same concept across components.
- Do not put terminal punctuation on short labels.

Icon-only actions require an accessible name that describes the action, not the
icon: `Open navigation`, not `Menu icon`.

## Help and descriptions

Put essential information in the label or nearby description rather than a
tooltip. Tooltips supplement unfamiliar icons or compact controls; they are not
the only place for validation, permissions, or required instructions.

Placeholder text is an example and disappears during input, so it never replaces
a visible label.

## Empty states

An empty state explains:

1. what is absent;
2. why that matters when useful;
3. the next available action.

Do not imply that an item is missing when it is still loading. Distinguish a
valid zero result from filtered results and a system failure.

Example:

```text
No saved prompts yet
Save a useful prompt to reuse it in future conversations.
[Create prompt]
```

## Errors

Errors should identify the failed task and offer a realistic recovery action.
Avoid exposing stack traces, provider names, request internals, secrets, or raw
validation objects.

```text
We couldn't save your changes
Your edits are still here. Check your connection and try again.
[Try again]
```

Inline validation states what is required and how to fix it. Do not announce an
error before the user has had a reasonable opportunity to complete the field.

## Loading and progress

Use a task-specific accessible label such as `Loading documents` or
`Generating preview`. Avoid repeatedly announcing percentage changes unless the
user benefits from exact progress. Preserve the action label when a button enters
a loading state.

## Destructive confirmation

Name the affected object and consequence. The primary destructive action uses
the destructive verb; cancellation uses a calm alternative.

```text
Delete “Quarterly notes”?
This removes the document from your workspace and cannot be undone.
[Cancel] [Delete document]
```

Do not use a generic confirmation dialog for a reversible or low-risk action.

## Inclusive and accessible language

- Avoid idioms, directional-only instructions, and culture-specific metaphors.
- Do not encode gender, ability, or identity assumptions in examples.
- Use fictional test data and names.
- Expand abbreviations on first use when the audience may not know them.
- Write link text that makes sense out of context.
- Do not communicate state using color words alone.

## Localization readiness

PADS does not concatenate sentence fragments. Component APIs accept complete
labels and descriptions so consumers can localize grammar and word order.
Layouts tolerate longer copy, wrapping, and bidirectional text. Numbers, dates,
units, and plural forms remain consumer-owned unless a PADS formatter explicitly
documents locale behavior.
