# Component catalog

This catalog defines the intended PADS hierarchy and ownership vocabulary. The
public export map and released Storybook identify what is available in a given
version; a name in this catalog is not permission to publish an incomplete
component.

## Foundations

- `AuraProvider`: scoped appearance, brand, direction, and implementation
  context.
- Theme initialization helper: resolves saved/system appearance before
  hydration without owning product persistence.
- Design tokens: color, typography, spacing, radius, shadow, motion, layers,
  breakpoints, and component decisions.
- Reset and font styles: explicit opt-in global foundations.
- Product mark and curated icon contract.

## Primitives

### Actions and navigation

- Button and IconButton
- Link
- Segmented control
- Tabs
- Pagination

### Forms

- Field, label, description, and validation message
- Input, Textarea, PasswordInput, SearchInput, and NumberInput
- Checkbox and Radio
- Switch
- Select and Combobox
- Form grouping and action row
- File picker and Upload trigger

### Feedback and status

- Badge and Tag
- Progress and meter
- Spinner, Loader, and Skeleton
- Tooltip
- Toast/notification adapter
- Inline message and alert

### Disclosure and overlays

- Accordion/Collapse
- Popover
- Menu/Dropdown
- Dialog and AlertDialog
- Drawer

### Content and structure

- Text and Heading
- Divider
- Avatar
- ProductMark
- Card/Surface
- Table primitives
- VisuallyHidden

## Composites

- PageHeader
- EmptyState, ErrorState, and LoadingState
- SearchTrigger
- FileUpload
- ActionCard and ActionList
- MetricCard and MetricGrid
- UsageCard
- StatusSummary
- Product option/switcher presentation

Composites accept product copy and callbacks. They do not fetch data or navigate.

## Patterns

- CommandPalette and searchable command list
- SettingsNavigation, SettingsPanel, SettingsGroup, SettingsField, and
  SettingsActionRow
- ComposerDock, ComposerIdentity, and ToolToggle
- ContextPalette
- Activity and breakdown summaries
- MediaGrid, MediaCard, MediaPreview, ReferenceCard, and MaskEditor
- Comparison and similarity presentation
- User menu and shell navigation presentation

## Layouts

- Stack, Inline, Grid, and Container
- PageStack and Section
- SplitPane and comparison layout
- DashboardLayout
- SettingsLayout
- WorkspaceShell with controlled sidebar and header slots

Layouts own responsive geometry, reading order, and overflow behavior. They do
not import a router, state store, or product registry.

## Templates

- Dashboard template
- Settings template
- Authentication template
- Conversation template
- Writing/editor template
- Media studio and library templates
- Long-form reader template

Templates demonstrate complete structure while leaving business data, product
copy, authorization, services, and navigation with the consumer.

## Optional chart package

- Activity line/area chart
- Column chart
- Donut chart
- Radial capacity chart
- Horizontal comparison chart
- Chart grid, legend, tooltip, summary, empty state, and table alternative

All charts expose exact values outside color-only graphics and remain useful
without animation.

## Optional rich-content package

- Safe Markdown renderer
- Code block, language label, and copy action
- Rich-text editor surface and toolbar
- Long-form prose and table styles
- Block quote, list, link, and inline-code presentation

Document persistence, autosave, citation validation, provider output, and
product-specific schemas remain outside this package.

## Graduation checklist

A catalog item becomes stable only when it has:

- an owned product-neutral API;
- semantic token styling for light and dark modes;
- relevant brand review;
- keyboard, focus, screen-reader, motion, zoom, and touch behavior;
- meaningful-state stories and interaction tests;
- browser and visual evidence;
- API/package documentation;
- an accepted bundle budget;
- a Changeset.
