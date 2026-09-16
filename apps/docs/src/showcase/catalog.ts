import type * as ReactLibrary from "@praabindh/aura-design-system";
import type * as Charts from "@praabindh/aura-charts";
import type * as RichContent from "@praabindh/aura-rich-content";

export type ComponentName =
  keyof typeof ReactLibrary | keyof typeof Charts | keyof typeof RichContent;
export type Category =
  | "Foundations"
  | "Actions"
  | "Forms"
  | "Feedback"
  | "Navigation"
  | "Data display"
  | "Patterns"
  | "Layouts"
  | "Templates"
  | "Charts"
  | "Rich content";
export interface CatalogEntry {
  name: ComponentName;
  category: Category;
  description: string;
  story: string;
  package:
    | "@praabindh/aura-design-system"
    | "@praabindh/aura-charts"
    | "@praabindh/aura-rich-content";
}

function group(
  category: Category,
  story: string,
  items: Partial<Record<ComponentName, string>>,
): CatalogEntry[] {
  return Object.entries(items).map(([name, description]) => ({
    name: name as ComponentName,
    description,
    category,
    story,
    package:
      category === "Charts"
        ? "@praabindh/aura-charts"
        : category === "Rich content"
          ? "@praabindh/aura-rich-content"
          : "@praabindh/aura-design-system",
  }));
}

export const catalog: CatalogEntry[] = [
  ...group("Foundations", "foundations-typography-and-space--theme-runtime", {
    AuraProvider: "One boundary for brand, appearance, and component context.",
    ThemeToggle: "Switch appearance with a clear, accessible action.",
  }),
  ...group("Foundations", "foundations-typography-and-space--type-hierarchy", {
    Heading: "A clear heading hierarchy, from section titles to page introductions.",
    Text: "Consistent body copy with semantic size and emphasis.",
    Code: "Inline code that stays distinct from surrounding prose.",
    Kbd: "A recognizable label for keyboard keys and shortcuts.",
    Surface: "A quiet container with intentional padding and elevation.",
    Divider: "A subtle boundary between related pieces of content.",
    VisuallyHidden:
      "Extra context for assistive technology without a visual footprint.",
  }),
  ...group("Foundations", "primitives-actions-and-identity--identity-and-status", {
    Avatar: "Compact identity with an image or a readable fallback.",
    ProductMark: "The six Aura identities, with consistent geometry and color.",
  }),
  ...group("Actions", "primitives-actions-and-identity--all-variants", {
    Button: "Primary, secondary, ghost, and danger actions with native semantics.",
    IconButton: "A compact action with an explicit accessible name.",
    LinkButton: "Button hierarchy for actions that navigate to a destination.",
  }),
  ...group("Forms", "forms-fields-and-choices--complete-form", {
    Field: "Keep labels, help, and validation connected to the control.",
    Input: "A familiar single-line field with native input behavior.",
    Textarea: "Room for longer thoughts, briefs, and descriptions.",
    Select: "Choose one option from a native, typed selection control.",
    Checkbox: "Independent choices with native checked and disabled states.",
    RadioGroup: "A labelled set of mutually exclusive choices.",
    Switch: "An immediate on or off choice with a persistent label.",
    SegmentedControl: "A small set of related choices, with arrow-key navigation.",
    Slider: "Explore a numeric range with keyboard and pointer input.",
    FileDropzone: "Select files through a labelled native file control.",
  }),
  ...group("Forms", "forms-fields-and-choices--search-and-disabled", {
    SearchInput: "Find content with an identifiable search field.",
  }),
  ...group("Feedback", "primitives-actions-and-identity--identity-and-status", {
    Badge: "Short status labels with meaning beyond color.",
    Progress: "A labelled measure of completion or capacity.",
    Skeleton: "A structured placeholder while content is loading.",
    Spinner: "A named activity indicator for an indeterminate wait.",
  }),
  ...group("Feedback", "feedback-states-and-overlays--state-matrix", {
    Alert: "Explain an update with a semantic tone, icon, and message.",
    EmptyState: "Explain an empty surface and offer a useful next step.",
    ErrorState: "Describe a failure and make retrying straightforward.",
    LoadingState: "An accessible loading message for a whole surface.",
  }),
  ...group("Feedback", "feedback-states-and-overlays--overlay-controls", {
    Dialog: "A focused layer with labelled content and managed focus.",
    Drawer: "Supporting content in a dismissible side panel.",
    Confirm: "Put context and a deliberate choice before an important action.",
    Tooltip: "Brief supporting context attached to a focusable control.",
  }),
  ...group("Navigation", "navigation-wayfinding--navigation-set", {
    Breadcrumbs: "Show the path from a broad section to the current location.",
    Tabs: "Switch related views with a familiar keyboard model.",
    Pagination: "Move through pages while keeping the current position clear.",
    SkipLink: "Give keyboard users a direct route to the main content.",
  }),
  ...group("Data display", "data-display-tables-and-values--package-inventory", {
    DataTable: "Semantic rows and columns with a caption and scroll region.",
    DescriptionList: "Make labelled facts and metadata easy to scan.",
    Stat: "Give one meaningful value a clear label and supporting context.",
  }),
  ...group("Patterns", "patterns-product-workflows--dashboard-cards", {
    PageHeader: "Bring page identity, description, and actions together.",
    Section: "A titled content group with space for a supporting action.",
    CardGrid: "Arrange related cards in a responsive collection.",
    ActionCard: "Turn an icon, title, and explanation into one clear action.",
    MetricCard: "A prominent value with a label, hint, and visual context.",
    UsageCard: "Capacity, consumption, and remaining allowance in one place.",
  }),
  ...group("Patterns", "patterns-product-workflows--command-and-status-utilities", {
    CommandPalette: "Search and invoke commands in a keyboard-friendly dialog.",
    StatusBadge: "Combine a concise status label with an optional icon.",
    ContextAction: "A small directional cue for a contextual action.",
  }),
  ...group("Patterns", "patterns-product-workflows--composer-and-palette", {
    ComposerDock: "A collapsible writing surface with caller-owned controls.",
    ContextPalette: "A keyboard-navigable list of contextual choices.",
  }),
  ...group("Patterns", "patterns-product-workflows--settings-workspace", {
    SettingsLayout: "Section navigation beside a focused settings surface.",
    SettingsPanel: "A titled panel for a coherent set of preferences.",
    SettingsGroup: "Group related preferences with helpful context.",
    SettingsRow: "Pair a setting and its explanation with a control.",
  }),
  ...group("Patterns", "patterns-product-workflows--media-library", {
    MediaGrid: "A responsive collection of media and asset previews.",
    MediaPreview: "Image and video presentation with a useful fallback.",
    MediaCard: "A media preview with its title, description, and metadata.",
    ReferenceCard: "Compact source context with an optional action.",
  }),
  ...group("Layouts", "layouts-responsive-workspaces--composition-primitives", {
    Box: "A minimal, styled container for composition.",
    Stack: "Vertical rhythm using the shared spacing scale.",
    Inline: "A wrapping row of related content and controls.",
    Grid: "Responsive columns for repeatable content.",
    Container: "Constrain content to a readable, semantic width.",
  }),
  ...group("Layouts", "layouts-responsive-workspaces--workspace-composition", {
    WorkspaceSurface: "The main content landmark of a workspace.",
    PageLayout: "Choose a reading, wide, or full-width page surface.",
    DashboardLayout: "A main area and a responsive supporting column.",
    SplitPane: "Two related work areas that respond to available space.",
    SidebarLayout: "Structure a sidebar with header, navigation, and footer.",
    TopBar: "Align leading content, a central slot, and supporting actions.",
  }),
  ...group("Layouts", "layouts-responsive-workspaces--application-shell", {
    AppShell: "An application frame with responsive sidebar and mobile navigation.",
  }),
  ...group("Templates", "templates-product-neutral-surfaces--authentication", {
    AuthTemplate: "A welcoming identity panel beside caller-owned sign-in content.",
  }),
  ...group("Templates", "templates-product-neutral-surfaces--dashboard", {
    DashboardTemplate: "A page introduction, main dashboard, and supporting content.",
  }),
  ...group("Templates", "templates-product-neutral-surfaces--settings-surface", {
    SettingsTemplate: "A complete settings structure, ready for your preferences.",
  }),
  ...group("Templates", "templates-product-neutral-surfaces--conversation", {
    ConversationTemplate: "A flexible conversation body with a dedicated composer.",
  }),
  ...group("Templates", "templates-product-neutral-surfaces--editor-comparison", {
    EditorTemplate: "A two-pane editor with toolbar and footer slots.",
  }),
  ...group("Templates", "templates-product-neutral-surfaces--media-studio", {
    MediaStudioTemplate: "Bring media controls, a preview, and references together.",
  }),
  ...group("Charts", "optional-packages-charts--usage-dashboard", {
    ActivityChart: "Compare series over time with accessible exact-value data.",
    ColumnChart: "Compare category values through a restrained column chart.",
    DonutChart: "Show parts of a whole with a labelled total and legend.",
    RadialChart: "Make a single capacity or completion value easy to read.",
    ChartGrid: "Arrange chart cards without crowding their content.",
  }),
  ...group("Charts", "optional-packages-charts--comparison-and-empty", {
    HorizontalBarChart: "Compare labelled values with room for longer category names.",
  }),
  ...group("Rich content", "optional-packages-rich-content--long-form-reader", {
    RichMarkdown: "Readable Markdown with safe links, tables, and code presentation.",
  }),
];

export const categories = [...new Set(catalog.map((entry) => entry.category))];
export const utilities = [
  "useAura",
  "useAuraFeedback",
  "getAuraThemeScript",
  "AuraThemeScript",
] as const;
export const repositoryUrl = "https://github.com/praabindhp/Aura-Design-System";
export const componentHref = (name: ComponentName) => `#/components/${name}`;
export const storyHref = (story: string, brand: string, theme: string) =>
  `./storybook/?path=/story/${story}&globals=brand:${brand};theme:${theme}`;
