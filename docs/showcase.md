# PADS showcase and component explorer

The documentation application in `apps/docs` contains the PADS showcase, a
searchable component explorer, foundations, setup guidance, and Storybook. It
consumes public package entry points and generated tokens. It does not change
published component APIs or package artifacts, so this documentation-only change
does not require a Changeset or declaration migration.

## Design-system review

The implemented public library contains 88 components and four runtime helpers
across React, charts, and rich content. The five published packages retain their
existing dependency direction. The optional charts and rich-content packages
remain separate from the base package.

The canonical source currently provides six recipes: Aura, VerbAura, CognAura,
RendAura, CharterAura, and CharterAura Intermediate. Every recipe supports light
and dark appearances; system mode follows the browser preference. The showcase
starts with VerbAura's warm action color in dark mode, and stores only the
visitor's brand and theme preferences locally.

The intended component catalog in `component-catalog.md` includes future ideas.
The live explorer lists only actual public exports. For example, date pickers,
accordions, a rich-text editor, and a separately exported code block are not
advertised as released components. Code examples use the public `RichMarkdown`
renderer. Whole-page components have explicitly labelled structure thumbnails
and an isolated, interactive Storybook canvas to preserve page landmarks.

The audit also found that the optional `MediaGrid` label currently puts
`aria-label` on a generic `div`, which axe reports as a prohibited attribute.
The showcase uses the surrounding card heading instead. Correcting that public
component behavior belongs in a separate component change with its own story,
behavior test, and Changeset; this documentation change does not alter it.

## Experience

- `#/`: original PADS showcase with working local form, preference, segmented
  control, and conversation examples, plus charts and identity compositions.
- `#/components`: searchable, category-filtered catalog with live previews.
- `#/components/Button`: directly linkable detail pages with an import example,
  contextual guidance, and the matching Storybook canvas.
- `#/foundations`: semantic color specimens, typography, token layers, and a
  searchable table of the active recipe's resolved tokens.
- `#/start`: installation, provider setup, package boundaries, and runtime helpers.
- `storybook/`: the full existing Storybook, including interactions and states.

The site is static. Example forms do not create accounts, upload files, send
messages, or call a backend. Appearance storage is optional and failures do not
prevent use. Fonts are served from the built package assets. No analytics or
additional runtime service is introduced.

## Local development and production preview

Use the repository's declared Node and npm versions:

```bash
npm ci
npm run build:packages
npm run showcase
```

For a complete production build, including the embedded Storybook:

```bash
npm run docs:build
npm run docs:preview
```

The development server runs on port 4173. Build and preview the full documentation
artifact to use the embedded Storybook paths. Relative assets and hash routes
support both a GitHub project subpath and a custom domain without a rewrite server.

`docs:assemble` verifies that catalog entries and runtime helpers exactly match
the public runtime exports, rejects duplicate entries, and checks every linked
story against Storybook's generated index. It then assembles `apps/docs/dist`
with Storybook in its `storybook` subdirectory. Generated output stays ignored.

## GitHub Pages deployment

The repository owner must enable **Settings → Pages → Build and deployment →
Source: GitHub Actions**. The source repository may remain private; Pages
availability for private repositories depends on the owner's GitHub plan.
Publishing this site does not make the repository or npm packages public.

The `Documentation` workflow builds and deploys the commit whose `Quality`
workflow passed on a push to `main`. It can also be dispatched manually. Its
`github-pages` environment exposes the authoritative deployed URL. Automatic
builds do not run for pull-request completions. The workflow uses immutable action
revisions, a locked install, read-only source credentials, and grants Pages and
OIDC permissions only to the deployment job.

The expected project URL, absent a custom domain, is
`https://praabindhp.github.io/Aura-Design-System/`. Treat this as an expected URL
until the workflow confirms deployment; a committed workflow alone does not
activate the repository's Pages settings.

The build artifact contains only the showcase and built Storybook, rather than
the repository working tree. Existing Storybook examples and bundled code are
part of the published documentation. Restricted npm package access remains
necessary to install the library.

See GitHub's [custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and [publishing source configuration](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Verification and maintenance

Run `npm run verify`. The completion gate now assembles the documentation and
runs showcase browser checks against `/Aura-Design-System/`, in addition to
existing package, accessibility, export, bundle, Storybook, and consumer checks.
The new checks cover example actions, brand persistence, system mode, filtering,
empty results, deep-link reloads, Storybook embedding, keyboard choices, overlay
focus restoration, error recovery, and local confirmation.

Review the site in both modes and every brand, at 320, 375, 768, and 1440 CSS
pixels, and at 200% zoom. Browser reflow checks include a 640px viewport, the CSS
layout equivalent of a 1280px viewport at 200% zoom. That check is supplementary
to visual zoom review and does not claim complete screen-reader conformance.

When adding an export, add its catalog metadata, representative preview, and
correct Storybook ID. Preserve the `#/components/Name` deep links for existing
components. Page and template previews must not introduce duplicate main
landmarks into the gallery. Test empty states and reloads before deploying.

To roll back, revert the documentation commit on `main`; the next successful
Quality run deploys the reverted site. Existing Storybook entry points remain
available under `storybook/`.
