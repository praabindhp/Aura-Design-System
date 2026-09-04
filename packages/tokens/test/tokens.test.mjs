import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  auraBrands,
  browserThemeColor,
  getThemeTokens,
  isAuraBrand,
  isThemeMode,
  isThemePreference,
  resolveThemePreference,
  themeModes,
} from "../dist/index.js";

const packageDirectory = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const commonJsTokens = require("../dist/index.cjs");
const generatedCss = readFileSync(join(packageDirectory, "dist", "tokens.css"), "utf8");
const generatedJson = JSON.parse(
  readFileSync(join(packageDirectory, "dist", "tokens.json"), "utf8"),
);
const packageManifest = JSON.parse(
  readFileSync(join(packageDirectory, "package.json"), "utf8"),
);

test("publishes stable theme and brand guards", () => {
  assert.deepEqual(themeModes, ["light", "dark"]);
  assert.deepEqual(auraBrands, [
    "aura",
    "verbaura",
    "cognaura",
    "rendaura",
    "charteraura",
    "charteraura-intermediate",
  ]);
  assert.equal(isThemeMode("dark"), true);
  assert.equal(isThemeMode("system"), false);
  assert.equal(isThemePreference("system"), true);
  assert.equal(isAuraBrand("cognaura"), true);
  assert.equal(isAuraBrand("unknown"), false);
});

test("publishes matching ESM and CommonJS contracts with mode-specific declarations", () => {
  assert.deepEqual(Object.keys(commonJsTokens).sort(), [
    "auraBrands",
    "browserThemeColor",
    "getThemeTokens",
    "isAuraBrand",
    "isThemeMode",
    "isThemePreference",
    "resolveThemePreference",
    "themeModes",
  ]);
  assert.deepEqual(commonJsTokens.auraBrands, auraBrands);
  assert.deepEqual(commonJsTokens.themeModes, themeModes);
  assert.equal(commonJsTokens.browserThemeColor("dark"), browserThemeColor("dark"));

  const esmDeclarations = readFileSync(
    join(packageDirectory, "dist", "index.d.ts"),
    "utf8",
  );
  const commonJsDeclarations = readFileSync(
    join(packageDirectory, "dist", "index.d.cts"),
    "utf8",
  );
  assert.equal(commonJsDeclarations, esmDeclarations);
  assert.deepEqual(packageManifest.exports["."], {
    import: {
      types: "./dist/index.d.ts",
      default: "./dist/index.js",
    },
    require: {
      types: "./dist/index.d.cts",
      default: "./dist/index.cjs",
    },
  });
});

test("resolves system preferences deterministically", () => {
  assert.equal(resolveThemePreference("system"), "light");
  assert.equal(resolveThemePreference("system", true), "dark");
  assert.equal(resolveThemePreference("dark", false), "dark");
  assert.throws(() => resolveThemePreference("sepia"), RangeError);
});

test("returns immutable, key-stable token maps for every combination", () => {
  const referenceKeys = Object.keys(getThemeTokens("light", "aura"));
  for (const mode of themeModes) {
    for (const brand of auraBrands) {
      const map = getThemeTokens(mode, brand);
      assert.equal(Object.isFrozen(map), true);
      assert.deepEqual(Object.keys(map), referenceKeys);
      assert.equal(map["--aura-brand-action"].startsWith("#"), true);
      assert.equal(map[`--aura-mark-${brand}-bg`].startsWith("#"), true);
      assert.equal(map[`--aura-mark-${brand}-fg`].startsWith("#"), true);
    }
  }
  assert.throws(() => getThemeTokens("light", "unknown"), RangeError);
  assert.throws(() => getThemeTokens("sepia", "aura"), RangeError);
});

test("includes the public foundation and semantic variable contract", () => {
  const map = getThemeTokens("light", "aura");
  const requiredNames = [
    "--aura-font-sans",
    "--aura-font-mono",
    "--aura-font-size-caption",
    "--aura-font-size-display",
    "--aura-line-height-body",
    "--aura-space-1",
    "--aura-space-16",
    "--aura-radius-pill",
    "--aura-border-width-thin",
    "--aura-motion-fast",
    "--aura-motion-reduced-duration",
    "--aura-motion-easing-standard",
    "--aura-size-control-sm",
    "--aura-size-target-comfortable",
    "--aura-size-mark-md",
    "--aura-size-avatar-md",
    "--aura-size-progress-track",
    "--aura-size-skeleton-line",
    "--aura-size-sidebar-expanded",
    "--aura-size-header",
    "--aura-size-reading",
    "--aura-size-composer",
    "--aura-container-xl",
    "--aura-breakpoint-md",
    "--aura-dialog-width-lg",
    "--aura-overlay-blur",
    "--aura-overlay-scrim",
    "--aura-chart-stroke-width",
    "--aura-chart-track-width",
    "--aura-focus-width",
    "--aura-focus-stroke",
    "--aura-bg-app",
    "--aura-bg-inverse",
    "--aura-text-primary",
    "--aura-border-control",
    "--aura-brand-action",
    "--aura-brand-on-solid",
    "--aura-status-success-content",
    "--aura-status-danger-on-solid",
    "--aura-shadow-lg",
    "--aura-z-toast",
    "--aura-color-background-canvas",
    "--aura-color-foreground-primary",
    "--aura-color-brand-action-hover",
    "--aura-color-control-selected-background",
    "--aura-color-code-inline-text",
  ];
  for (const name of requiredNames) {
    assert.equal(typeof map[name], "string", `${name} is missing`);
    assert.notEqual(map[name], "", `${name} is empty`);
  }
});

test("exposes stable browser chrome colors", () => {
  for (const mode of themeModes) {
    assert.equal(
      browserThemeColor(mode),
      getThemeTokens(mode, "aura")["--aura-bg-app"],
    );
  }
  assert.notEqual(browserThemeColor("light"), browserThemeColor("dark"));
  assert.throws(() => browserThemeColor("system"), RangeError);
});

test("ships explicit, system, scoped, reduced-motion, and forced-color CSS", () => {
  assert.match(generatedCss, /prefers-color-scheme:\s*dark/u);
  assert.match(generatedCss, /prefers-reduced-motion:\s*reduce/u);
  assert.match(generatedCss, /forced-colors:\s*active/u);
  assert.match(generatedCss, /\[data-aura-scope\]/u);
  assert.match(generatedCss, /data-aura-theme="system"/u);
  assert.match(generatedCss, /data-aura-brand="charteraura-intermediate"/u);
  assert.match(generatedCss, /--aura-focus-stroke:\s*Highlight/u);
});

test("records passing WCAG contrast evidence for every mode and brand", () => {
  const expectedChecks = themeModes.length * auraBrands.length * 18;
  assert.equal(generatedJson.contrast.length, expectedChecks);
  for (const result of generatedJson.contrast) {
    assert.ok(
      result.ratio >= result.minimum,
      `${result.mode}/${result.brand} contrast failed`,
    );
  }
});

test("generated artifacts have no drift", () => {
  execFileSync(
    process.execPath,
    [join(packageDirectory, "scripts", "build.mjs"), "--check"],
    {
      cwd: packageDirectory,
      stdio: "pipe",
    },
  );
});
