# Security policy

PADS is client-side design-system software, but supply-chain integrity, safe DOM
behavior, dependency hygiene, and responsible disclosure remain part of user
trust.

## Supported versions

Security fixes are provided for the latest stable major version. When a major
upgrade requires a migration window, the immediately previous major may receive
critical fixes for up to six months after the newer major becomes stable. Exact
support dates are recorded in release notes.

Pre-release and experimental APIs receive best-effort fixes and must not be
treated as a long-term security boundary.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability.

Use GitHub's private vulnerability reporting for the
[`praabindh/Aura-Design-System`](https://github.com/praabindh/Aura-Design-System/security/advisories/new)
repository. Include:

- affected package and version;
- impact and realistic attack scenario;
- minimal reproduction or proof of concept;
- affected browsers or environments;
- suggested mitigation, if known;
- whether the report is subject to an embargo.

The maintainer aims to acknowledge a complete report within three business days
and provide an initial severity assessment within seven business days. Remediation
timing depends on severity, affected consumers, and coordinated disclosure needs.
Please allow a fix and consumer update window before public disclosure.

## Security scope

Relevant reports include, but are not limited to:

- unsafe HTML, URL, Markdown, SVG, or rich-content rendering;
- focus or overlay behavior that can facilitate clickjacking or spoofing;
- leakage of sensitive consumer data through DOM attributes, logs, examples, or
  telemetry;
- compromised or incorrectly published npm artifacts;
- dependency confusion, install-script abuse, or publication-integrity failures;
- package exports that unexpectedly execute server-unsafe browser code;
- denial-of-service behavior caused by unbounded input processing.

Pure visual bugs without a security consequence should use the bug template.
Vulnerabilities in a product's authentication, API, storage, provider, or
authorization layer belong to that product's private reporting channel.

## Repository safeguards

- Dependencies and GitHub Actions are pinned and reviewed.
- CI uses clean installs and minimum required permissions.
- Restricted packages are checked with package linters and a packed consumer
  before release.
- npm releases are produced only by protected CI using least-privilege access
  to the private `@praabindh` scope; versions are immutable.
- Generated token output is reproducible from reviewed source.
- Rich content is treated as untrusted input; unsafe HTML is not enabled by
  default.
- PADS does not collect telemetry or own secrets.

Maintainers should publish a security advisory, patched versions, and migration
or mitigation guidance together when disclosure is appropriate.
