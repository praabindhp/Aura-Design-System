# Releasing

PADS publishes immutable, restricted packages from the private GitHub
repository through protected CI. A local machine may build and inspect a
package but must not be the normal release authority.

## Version policy

PADS follows Semantic Versioning:

- **Patch**: backward-compatible fixes, accessibility corrections that preserve
  documented interaction, and package/documentation corrections.
- **Minor**: new backward-compatible components, variants, tokens, brands, or
  public APIs.
- **Major**: removed or renamed exports, removed tokens, stricter required props,
  changed minimum runtimes, or materially changed documented behavior.

A visual change can be breaking even when TypeScript still compiles. Assess
layout, focus, content density, token meaning, and automation selectors as part
of compatibility.

## Changesets

Every consumer-visible pull request adds a Changeset:

```bash
npm run changeset
```

The summary should tell consumers what changes and whether they need to act.
Avoid internal commit language.

All publishable PADS packages begin at `1.0.0` and use synchronized versions on
one release train. Internal dependency ranges and lockfiles are updated by the
versioning workflow, not manually after publication.

## Pre-release channels

Breaking work or product validation may use an explicit prerelease channel such
as `next`. Pre-releases:

- never replace the `latest` tag;
- remain visibly labelled in documentation;
- receive no stable API guarantee;
- graduate only after package, accessibility, browser, and migration evidence.

## Release workflow

1. Merge a reviewed consumer change and its Changeset to protected `main`.
2. The release workflow verifies that exact commit in a read-only job. This job
   receives only `contents: read`, performs a clean install, and runs the full
   verification gate before any write or OIDC permission exists.
3. The write job becomes eligible only in the canonical repository when the
   repository variable `PADS_RELEASE_ENABLED` is exactly `true`. It depends on
   the successful read-only job and targets the protected `npm-release` GitHub
   environment, where required reviewers provide the human approval boundary.
4. After approval, the write job performs another clean install without a
   dependency cache, rebuilds the publishable packages, and rechecks their
   packed artifacts.
5. When unconsumed Changesets remain, Changesets creates or updates a version
   pull request containing versions and changelogs. It does not publish in this
   path. The version pull request is an ordinary pull request: the normal
   quality workflow runs, review is required, and it must be merged to `main`.
6. When the merged `main` commit contains version updates and no unconsumed
   Changesets, Changesets publishes the immutable packages, then creates the
   corresponding Git tags and GitHub releases.
7. Verify npm metadata, restricted installation, documentation links, and the
   authenticated Storybook artifact after publication.

Only the second job receives `contents: write`, `pull-requests: write`, and
`id-token: write`. npm 11.18 uses the GitHub Actions OIDC identity to obtain a
short-lived publish credential from npm trusted publishing. The workflow does
not store or pass an `NPM_TOKEN`. The built-in `GITHUB_TOKEN` is passed only to
Changesets for its version pull request, tags, releases, and repository changes.

Environment approval applies before the Changesets decision, so a reviewer may
be approving either a version-pull-request update or an immutable publish. The
repository variable is a separate hard disable switch; environment protection
does not replace it. Required-reviewer enforcement also depends on the GitHub
plan and repository settings, so confirm that the private repository actually
enforces the configured `npm-release` protection rules.

## Registry setup

Each publishable scoped package declares:

- `publishConfig.access: "restricted"`;
- its exact repository and workspace directory;
- MIT license, files allowlist, exports, types, and side effects;
- Node engine and peer dependency support;
- the synchronized PADS package version.

Only authorized PRAABINDH CORP accounts and CI may read or publish the restricted
scope. Configure each package's
[npm trusted publisher](https://docs.npmjs.com/trusted-publishers/) for GitHub
user `praabindh`, repository `Aura-Design-System`, workflow `release.yml`, and
environment `npm-release`. These values are case-sensitive, and every
package's `repository.url` must exactly match the canonical GitHub repository.

The current Changesets publish script invokes `npm publish`, so each trusted
publisher's allowed actions must explicitly permit direct publish. A stage-only
trusted publisher requires a separate workflow that calls `npm stage publish`
and handles interactive approval; do not switch this workflow to stage-only by
configuration alone. After trusted publishing is verified, configure npm to
require two-factor authentication and disallow traditional publish tokens.

The release job remains disabled until repository variable
`PADS_RELEASE_ENABLED` is explicitly set to `true`. This prevents the first push
from attempting registry publication before package ownership, the protected
environment, and trusted-publisher mappings have been reviewed.

Trusted-publisher mappings require an existing npm package. For a package's
first publication only:

1. keep `PADS_RELEASE_ENABLED` unset or set to `false`;
2. verify the exact protected commit and inspect every dry-run package;
3. publish with a short-lived, least-privilege granular access token authorized
   only for the bootstrap packages from a controlled maintainer environment;
4. revoke that bootstrap token immediately;
5. configure the exact GitHub owner, repository, workflow filename, and
   `npm-release` environment as the npm trusted publisher for every package;
6. configure the GitHub environment protections and required reviewers; and
7. set `PADS_RELEASE_ENABLED` to `true` only when the preceding controls are in
   place, and treat the first approved workflow publication as the reviewed
   OIDC validation release.

Do not add the bootstrap token to this workflow, repository variables, source,
or documentation examples.

The private repository can authenticate to npm through trusted publishing, but
it cannot provide a public npm provenance statement without exposing private
source-repository details. While PADS remains private, packages therefore do
not set `publishConfig.provenance` and release notes must not claim npm
provenance. OIDC still removes the long-lived publishing credential. Revisit
provenance only if the source repository becomes public and the disclosure has
been approved.

Consumers still authenticate for restricted install access with a read-only
credential. Package documentation must not imply anonymous registry
availability, and a registry credential must never be committed. Enable GitHub
secret scanning and push protection for the repository before release; these
repository controls are distinct from `npm run verify` and must not be implied
to run locally.

## Required release gates

- clean lockfile install;
- formatting, linting, and architecture checks;
- token generation and contrast validation;
- typecheck, unit, browser, accessibility, and visual tests;
- supported browser matrix for changed complex widgets;
- Storybook production build;
- TypeScript declaration and export-contract review;
- package build, `npm pack` inspection, Publint, and Are the Types Wrong;
- packed consumer typecheck and production build;
- bundle budgets;
- local credential-pattern scan and production dependency audit; and
- enabled repository secret scanning and push protection.

No `--force`, skipped lifecycle, ignored audit, or broad quality suppression is
permitted in a release job.

## Failed release

An npm version is immutable. If a release is defective:

1. stop or pause remaining publication when safe;
2. assess security and consumer impact;
3. deprecate the affected version with a useful message when appropriate;
4. fix forward with a new version;
5. publish migration or mitigation guidance;
6. record a post-incident ADR for systemic failures.

Do not delete tags, rewrite release history, or attempt to overwrite an npm
version.

## Deprecation and removal

A deprecation includes:

- the replacement API;
- a before/after example;
- first deprecated version;
- earliest removal major;
- product migration notes.

Stable deprecations normally remain functional for at least two minor releases
and 90 days. Removal occurs only in a major release unless retaining the API is a
security risk.

## Post-release checks

- Install packages in a clean temporary consumer using documented commands.
- Confirm CSS, declarations, source maps, fonts/assets, and optional entries are
  present.
- Confirm the main entry does not load chart or rich-content runtimes.
- Confirm GitHub and npm versions, tags, and changelogs agree.
- Announce required consumer action and link migration guidance.
