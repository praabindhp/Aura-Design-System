# Browser and runtime support

PADS supports modern evergreen browsers used by Aura products while preserving a
clear, testable baseline.

## Supported browsers

| Platform                         | Support policy                                                        |
| -------------------------------- | --------------------------------------------------------------------- |
| Chrome desktop and Android       | Current and previous stable major release                             |
| Edge desktop                     | Current and previous stable major release                             |
| Firefox desktop                  | Current and previous stable major release                             |
| Safari on macOS                  | Safari 17 or newer, including the current and previous stable release |
| Safari on iOS/iPadOS             | iOS/iPadOS 17 or newer                                                |
| Chromium-based embedded webviews | Supported when equivalent to a supported Chrome release               |

Internet Explorer and browsers without native ES modules are not supported.
Products with a stricter audience requirement may add transpilation or
polyfills, but PADS does not silently ship global polyfills.

## Node and toolchain

- Node.js 22.14 or newer is required to install and build the repository.
- CI verifies the minimum supported Node line and the current production Node
  line.
- npm 11.18.0 or newer is the repository package manager.
- Published browser modules do not rely on Node built-ins at runtime.

## Feature baseline

PADS may use native CSS custom properties, logical properties, grid, flexbox,
container queries, `color-mix()`, `:focus-visible`, `:has()`, and modern ESM.
Fallbacks are supplied when the lack of enhancement would block a core task or
accessibility requirement.

Progressive enhancements such as backdrop blur may be omitted by a browser
without losing content, action, focus, or readable contrast.

## Responsive baseline

Components are designed for:

- 320 CSS-pixel minimum application viewports;
- touch and pointer input;
- portrait and landscape orientation;
- 200% browser zoom without loss of content or operation;
- dynamic mobile visual viewports and software keyboards;
- narrow containers within otherwise wide pages.

## Testing matrix

Pull-request CI runs fast representative browser coverage. Release and scheduled
CI exercise Chromium, Firefox, and WebKit. Visual baselines use a pinned browser
and OS environment so diffs remain meaningful.

A defect in a supported browser is a PADS defect. A browser-specific workaround
must remain inside the owning primitive or adapter and include a regression
test. Consumer products should not fork component CSS by user agent.

## Changing support

Raising the minimum browser or Node version is a consumer-visible change. It
requires usage evidence, migration guidance, a Changeset, and normally a major
release. Adding support without changing existing behavior is minor or patch
according to the shipped surface.
