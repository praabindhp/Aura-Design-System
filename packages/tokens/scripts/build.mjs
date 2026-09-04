import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = join(packageDirectory, "src", "aura.tokens.json");
const outputDirectory = join(packageDirectory, "dist");
const checkOnly = process.argv.includes("--check");
const compilerVersion = 1;
const supportedTokenTypes = new Set([
  "color",
  "cubicBezier",
  "dimension",
  "duration",
  "fontFamily",
  "fontWeight",
  "number",
  "shadow",
]);

const sourceText = readFileSync(sourcePath, "utf8");
const source = JSON.parse(sourceText);
const pads = source.$extensions?.["org.praabindh.pads"];

assert(
  source.$schema === "https://www.designtokens.org/schemas/2025.10/format.json",
  "The canonical source must target the DTCG 2025.10 schema.",
);
assert(
  pads?.specification === "DTCG 2025.10",
  "The PADS extension must declare DTCG 2025.10.",
);
assert(
  Array.isArray(pads?.themes) && pads.themes.length > 0,
  "At least one theme is required.",
);
assert(
  Array.isArray(pads?.brands) && pads.brands.length > 0,
  "At least one brand is required.",
);

const themeModes = Object.freeze([...pads.themes]);
const auraBrands = Object.freeze([...pads.brands]);
const tokens = new Map();

collectTokens(source.foundation, ["foundation"]);
collectTokens(source.theme, ["theme"]);
collectTokens(source.brand, ["brand"]);
assert(tokens.size > 0, "No design tokens were found.");

const resolvedTokenCache = new Map();
for (const tokenPath of tokens.keys()) {
  resolveToken(tokenPath);
}

validateModeAndBrandParity();
validateRawColorOwnership();

const resolvedSets = Object.fromEntries(
  themeModes.map((mode) => [
    mode,
    Object.fromEntries(
      auraBrands.map((brand) => [brand, createResolvedSet(mode, brand)]),
    ),
  ]),
);

validateResolvedKeyParity(resolvedSets);
const contrastReport = validateContrast(resolvedSets);

const sourceIntegrity = `sha256-${createHash("sha256").update(sourceText).digest("hex")}`;
const tokenJson = `${JSON.stringify(
  {
    $description: "Generated, resolved PADS token maps. Do not edit.",
    specification: pads.specification,
    compilerVersion,
    sourceIntegrity,
    defaultTheme: pads.defaultTheme,
    defaultBrand: pads.defaultBrand,
    themes: themeModes,
    brands: auraBrands,
    contrast: contrastReport,
    values: mapResolvedSets(resolvedSets, ({ css }) => css),
  },
  null,
  2,
)}\n`;

const antThemeJson = `${JSON.stringify(
  {
    $description: "Generated PADS-to-Ant semantic adapter input. Do not edit.",
    sourceIntegrity,
    values: createAntThemeSets(resolvedSets),
  },
  null,
  2,
)}\n`;

const outputs = new Map([
  ["tokens.css", createCss(resolvedSets, sourceIntegrity)],
  ["tokens.json", tokenJson],
  ["ant-theme.json", antThemeJson],
  ["index.js", createJavaScript(resolvedSets, false, sourceIntegrity)],
  ["index.cjs", createJavaScript(resolvedSets, true, sourceIntegrity)],
  ["index.d.ts", createDeclarations()],
  ["index.d.cts", createDeclarations()],
]);

if (checkOnly) {
  checkGeneratedOutputs(outputs);
  process.stdout.write(
    `PADS tokens are valid and generated artifacts are current (${tokens.size} source tokens, ${contrastReport.length} contrast checks).\n`,
  );
} else {
  mkdirSync(outputDirectory, { recursive: true });
  for (const [name, contents] of outputs) {
    writeFileSync(join(outputDirectory, name), contents, "utf8");
  }
  process.stdout.write(
    `Generated ${outputs.size} PADS artifacts from ${tokens.size} source tokens; ${contrastReport.length} contrast checks passed.\n`,
  );
}

function collectTokens(node, path, inheritedType) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    return;
  }

  const tokenType = node.$type ?? inheritedType;
  if (Object.hasOwn(node, "$value")) {
    const tokenPath = path.join(".");
    assert(tokenType, `Token ${tokenPath} has no $type and does not inherit one.`);
    assert(
      supportedTokenTypes.has(tokenType),
      `Token ${tokenPath} uses unsupported type ${tokenType}.`,
    );
    assert(!tokens.has(tokenPath), `Duplicate token ${tokenPath}.`);
    validateTypedValue(node.$value, tokenType, tokenPath);
    tokens.set(tokenPath, { type: tokenType, value: node.$value });
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith("$")) {
      collectTokens(value, [...path, key], tokenType);
    }
  }
}

function validateTypedValue(value, type, tokenPath) {
  if (typeof value === "string" && isAlias(value)) {
    return;
  }

  switch (type) {
    case "color":
      assert(isColor(value), `Token ${tokenPath} must be a DTCG sRGB color object.`);
      break;
    case "dimension":
      assert(
        isMeasurement(value, ["px", "rem", "em"]),
        `Token ${tokenPath} must be a supported dimension.`,
      );
      break;
    case "duration":
      assert(
        isMeasurement(value, ["ms", "s"]),
        `Token ${tokenPath} must be a supported duration.`,
      );
      break;
    case "cubicBezier":
      assert(
        Array.isArray(value) && value.length === 4 && value.every(Number.isFinite),
        `Token ${tokenPath} must be a cubic Bézier tuple.`,
      );
      break;
    case "fontFamily":
      assert(
        Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => typeof item === "string"),
        `Token ${tokenPath} must be a font-family list.`,
      );
      break;
    case "fontWeight":
    case "number":
      assert(Number.isFinite(value), `Token ${tokenPath} must be numeric.`);
      break;
    case "shadow":
      assert(
        value && typeof value === "object" && !Array.isArray(value),
        `Token ${tokenPath} must be a shadow object.`,
      );
      break;
    default:
      assert(false, `Unsupported type ${type} at ${tokenPath}.`);
  }
}

function resolveToken(tokenPath, stack = []) {
  if (resolvedTokenCache.has(tokenPath)) {
    return resolvedTokenCache.get(tokenPath);
  }
  assert(tokens.has(tokenPath), `Alias references missing token ${tokenPath}.`);
  assert(
    !stack.includes(tokenPath),
    `Circular alias: ${[...stack, tokenPath].join(" -> ")}.`,
  );

  const token = tokens.get(tokenPath);
  const resolvedValue = resolveValue(token.value, [...stack, tokenPath]);
  validateTypedValue(resolvedValue, token.type, tokenPath);
  const resolvedToken = Object.freeze({ type: token.type, value: resolvedValue });
  resolvedTokenCache.set(tokenPath, resolvedToken);
  return resolvedToken;
}

function resolveValue(value, stack) {
  if (typeof value === "string") {
    if (isAlias(value)) {
      return structuredClone(resolveToken(value.slice(1, -1), stack).value);
    }
    assert(
      !value.includes("{") && !value.includes("}"),
      `Malformed alias in ${stack.at(-1)}.`,
    );
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveValue(item, stack));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveValue(item, stack)]),
    );
  }
  return value;
}

function validateModeAndBrandParity() {
  validatePathParity(
    themeModes.map((mode) => [`theme.${mode}.`, mode]),
    "theme",
  );
  for (const brand of auraBrands) {
    validatePathParity(
      themeModes.map((mode) => [`brand.${brand}.${mode}.`, `${brand}/${mode}`]),
      `brand ${brand}`,
    );
  }
  for (const mode of themeModes) {
    validatePathParity(
      auraBrands.map((brand) => [`brand.${brand}.${mode}.`, brand]),
      `${mode} brand`,
    );
  }
}

function validatePathParity(prefixEntries, label) {
  const [referencePrefix, referenceName] = prefixEntries[0];
  const referencePaths = relativeTokenPaths(referencePrefix);
  for (const [prefix, name] of prefixEntries.slice(1)) {
    const paths = relativeTokenPaths(prefix);
    assert(
      JSON.stringify(paths) === JSON.stringify(referencePaths),
      `${label} token drift between ${referenceName} and ${name}.`,
    );
  }
}

function relativeTokenPaths(prefix) {
  return [...tokens.keys()]
    .filter((tokenPath) => tokenPath.startsWith(prefix))
    .map((tokenPath) => tokenPath.slice(prefix.length))
    .sort();
}

function validateRawColorOwnership() {
  const authoredFiles = walk(packageDirectory).filter((filePath) => {
    const relativePath = relative(packageDirectory, filePath);
    return (
      !relativePath.startsWith("dist/") &&
      relativePath !== "src/aura.tokens.json" &&
      !relativePath.startsWith("scripts/")
    );
  });
  const rawHexPattern = /(^|[^\w])#[\da-f]{3,8}\b/giu;
  const functionalColorPattern =
    /\b(?:rgb|rgba|hsl|hsla|oklab|oklch|lab|lch|color)\s*\(/giu;
  for (const filePath of authoredFiles) {
    if (![".css", ".js", ".jsx", ".mjs", ".ts", ".tsx"].includes(extname(filePath))) {
      continue;
    }
    const contents = readFileSync(filePath, "utf8");
    assert(
      !rawHexPattern.test(contents) && !functionalColorPattern.test(contents),
      `Raw color found outside the canonical token source: ${relative(packageDirectory, filePath)}.`,
    );
    rawHexPattern.lastIndex = 0;
    functionalColorPattern.lastIndex = 0;
  }
}

function createResolvedSet(mode, brand) {
  const map = new Map();
  const add = (cssName, tokenPath) => {
    assert(!map.has(cssName), `Duplicate generated variable ${cssName}.`);
    const token = resolveToken(tokenPath);
    map.set(cssName, Object.freeze({ ...token, css: serializeToken(token) }));
  };
  const copy = (cssName, sourceName) => {
    assert(
      map.has(sourceName),
      `Cannot alias missing generated variable ${sourceName}.`,
    );
    assert(!map.has(cssName), `Duplicate generated variable ${cssName}.`);
    map.set(cssName, map.get(sourceName));
  };

  addGroup(add, "foundation.space", "--aura-space-");
  addGroup(add, "foundation.radius", "--aura-radius-");
  addGroup(add, "foundation.borderWidth", "--aura-border-width-");
  addGroup(add, "foundation.size", "--aura-size-");
  addGroup(add, "foundation.container", "--aura-container-");
  addGroup(add, "foundation.dialog.width", "--aura-dialog-width-");
  addGroup(add, "foundation.breakpoint", "--aura-breakpoint-");
  addGroup(add, "foundation.chart", "--aura-chart-");
  add("--aura-overlay-blur", "foundation.overlay.blur");
  addGroup(add, "foundation.focus", "--aura-focus-");
  addGroup(add, "foundation.font.family", "--aura-font-");
  addGroup(add, "foundation.font.size", "--aura-font-size-");
  addGroup(add, "foundation.font.weight", "--aura-font-weight-");
  addGroup(add, "foundation.lineHeight", "--aura-line-height-");
  add("--aura-motion-fast", "foundation.motion.duration.fast");
  add("--aura-motion-normal", "foundation.motion.duration.normal");
  add("--aura-motion-slow", "foundation.motion.duration.slow");
  add("--aura-motion-ambient", "foundation.motion.duration.ambient");
  add("--aura-motion-reduced-duration", "foundation.motion.duration.reduced");
  addGroup(add, "foundation.motion.easing", "--aura-motion-easing-");
  addGroup(add, "foundation.z", "--aura-z-");

  addGroup(add, `theme.${mode}.color.bg`, "--aura-bg-");
  addGroup(add, `theme.${mode}.color.text`, "--aura-text-");
  addGroup(add, `theme.${mode}.color.border`, "--aura-border-");
  addGroup(add, `theme.${mode}.color.control`, "--aura-color-control-");
  addGroup(add, `theme.${mode}.color.status`, "--aura-status-");
  addGroup(add, `theme.${mode}.color.code`, "--aura-color-code-");
  addGroup(add, `theme.${mode}.shadow`, "--aura-shadow-");

  addGroup(add, `brand.${brand}.${mode}.color.brand`, "--aura-brand-");
  addGroup(add, `brand.${brand}.${mode}.color.focus`, "--aura-focus-");
  addGroup(add, `brand.${brand}.${mode}.color.control`, "--aura-color-control-");

  copy("--aura-overlay-scrim", "--aura-bg-overlay");

  for (const [role, sourceName] of Object.entries({
    app: "--aura-bg-app",
    canvas: "--aura-bg-app",
    sidebar: "--aura-bg-sidebar",
    surface: "--aura-bg-surface",
    subtle: "--aura-bg-subtle",
    hover: "--aura-bg-hover",
    elevated: "--aura-bg-elevated",
    disabled: "--aura-bg-disabled",
    inverse: "--aura-bg-inverse",
    overlay: "--aura-bg-overlay",
  })) {
    copy(`--aura-color-background-${role}`, sourceName);
  }
  for (const role of ["primary", "secondary", "muted", "disabled", "inverse"]) {
    copy(`--aura-color-foreground-${role}`, `--aura-text-${role}`);
  }
  for (const role of ["decorative", "subtle", "strong", "control"]) {
    copy(`--aura-color-border-${role}`, `--aura-border-${role}`);
  }
  copy("--aura-color-border-default", "--aura-border-decorative");

  for (const [role, sourceName] of Object.entries({
    action: "--aura-brand-action",
    "action-hover": "--aura-brand-hover",
    "action-active": "--aura-brand-active",
    foreground: "--aura-brand-content",
    "on-action": "--aura-brand-on-solid",
    "background-soft": "--aura-brand-soft",
    "background-subtle": "--aura-brand-subtle",
    "border-strong": "--aura-brand-border-strong",
    glow: "--aura-brand-glow",
  })) {
    copy(`--aura-color-brand-${role}`, sourceName);
  }
  copy("--aura-color-focus-stroke", "--aura-focus-stroke");
  copy("--aura-color-focus-halo", "--aura-focus-halo");

  for (const status of ["success", "warning", "danger", "info"]) {
    for (const role of ["content", "bg", "border", "on-solid"]) {
      copy(`--aura-color-status-${status}-${role}`, `--aura-status-${status}-${role}`);
    }
  }

  for (const markBrand of auraBrands) {
    add(`--aura-mark-${markBrand}-bg`, `brand.${markBrand}.${mode}.color.brand.action`);
    add(
      `--aura-mark-${markBrand}-fg`,
      `brand.${markBrand}.${mode}.color.brand.onSolid`,
    );
  }

  return Object.freeze(
    Object.fromEntries([...map.entries()].sort(([a], [b]) => a.localeCompare(b))),
  );
}

function addGroup(add, tokenPrefix, cssPrefix) {
  const entries = [...tokens.keys()].filter((tokenPath) =>
    tokenPath.startsWith(`${tokenPrefix}.`),
  );
  assert(entries.length > 0, `No tokens found below ${tokenPrefix}.`);
  for (const tokenPath of entries.sort()) {
    const relativePath = tokenPath.slice(tokenPrefix.length + 1);
    add(`${cssPrefix}${kebab(relativePath.replaceAll(".", "-"))}`, tokenPath);
  }
}

function serializeToken({ type, value }) {
  switch (type) {
    case "color":
      return serializeColor(value);
    case "dimension":
    case "duration":
      return `${formatNumber(value.value)}${value.unit}`;
    case "fontFamily":
      return value.map(serializeFontFamily).join(", ");
    case "fontWeight":
    case "number":
      return formatNumber(value);
    case "cubicBezier":
      return `cubic-bezier(${value.map(formatNumber).join(", ")})`;
    case "shadow":
      return `${serializeMeasurement(value.offsetX)} ${serializeMeasurement(value.offsetY)} ${serializeMeasurement(value.blur)} ${serializeMeasurement(value.spread)} ${serializeColor(value.color)}`;
    default:
      throw new Error(`Cannot serialize token type ${type}.`);
  }
}

function serializeColor(value) {
  const rgb = value.components.map((component) => Math.round(component * 255));
  if (value.alpha === 1) {
    return `#${rgb
      .map((component) => component.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()}`;
  }
  return `rgb(${rgb.join(" ")} / ${formatNumber(value.alpha)})`;
}

function serializeMeasurement(value) {
  return `${formatNumber(value.value)}${value.unit}`;
}

function serializeFontFamily(value) {
  return /^[a-z-]+$/iu.test(value) ? value : `"${value.replaceAll('"', '\\"')}"`;
}

function validateResolvedKeyParity(sets) {
  const reference = Object.keys(sets[themeModes[0]][auraBrands[0]]);
  for (const mode of themeModes) {
    for (const brand of auraBrands) {
      const keys = Object.keys(sets[mode][brand]);
      assert(
        JSON.stringify(keys) === JSON.stringify(reference),
        `Generated variable drift in ${mode}/${brand}.`,
      );
    }
  }
}

function validateContrast(sets) {
  const report = [];
  for (const mode of themeModes) {
    for (const brand of auraBrands) {
      const set = sets[mode][brand];
      for (const pair of pads.contrastPairs) {
        const foreground = set[pair.foreground];
        const background = set[pair.background];
        assert(
          foreground?.type === "color",
          `Contrast foreground ${pair.foreground} is missing or not a color.`,
        );
        assert(
          background?.type === "color",
          `Contrast background ${pair.background} is missing or not a color.`,
        );
        assert(
          foreground.value.alpha === 1 && background.value.alpha === 1,
          `Contrast pair ${pair.foreground}/${pair.background} must resolve to opaque colors.`,
        );
        const ratio = contrastRatio(foreground.value, background.value);
        assert(
          ratio + 1e-9 >= pair.minimum,
          `${mode}/${brand}: ${pair.foreground} on ${pair.background} is ${ratio.toFixed(2)}:1; ${pair.minimum}:1 required.`,
        );
        report.push({ mode, brand, ...pair, ratio: Number(ratio.toFixed(2)) });
      }
    }
  }
  return report;
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first.components);
  const secondLuminance = relativeLuminance(second.components);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(components) {
  const [red, green, blue] = components.map((component) =>
    component <= 0.04045 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function createCss(sets, integrity) {
  const sections = [
    `/* Generated by @praabindh/aura-tokens from ${integrity}. Do not edit. */`,
    renderCssBlock([":root"], sets.light.aura, "light"),
    renderCssBlock(systemSelectors(), sets.light.aura, "light"),
  ];

  for (const brand of auraBrands) {
    sections.push(
      renderCssBlock(systemBrandSelectors(brand), sets.light[brand], "light"),
    );
  }
  for (const mode of themeModes) {
    sections.push(
      renderCssBlock(explicitDefaultSelectors(mode), sets[mode].aura, mode),
    );
    for (const brand of auraBrands) {
      sections.push(
        renderCssBlock(explicitBrandSelectors(mode, brand), sets[mode][brand], mode),
      );
    }
  }

  const darkSystemBlocks = [
    renderCssBlock(
      [":root:not([data-aura-theme])", ...systemSelectors()],
      sets.dark.aura,
      "dark",
      2,
    ),
  ];
  for (const brand of auraBrands) {
    darkSystemBlocks.push(
      renderCssBlock(systemBrandSelectors(brand), sets.dark[brand], "dark", 2),
    );
  }
  sections.push(
    `@media (prefers-color-scheme: dark) {\n${darkSystemBlocks.join("\n\n")}\n}`,
  );

  sections.push(`@media (prefers-reduced-motion: reduce) {
  :root,
  [data-aura-scope] {
    --aura-motion-fast: var(--aura-motion-reduced-duration);
    --aura-motion-normal: var(--aura-motion-reduced-duration);
    --aura-motion-slow: var(--aura-motion-reduced-duration);
    --aura-motion-ambient: var(--aura-motion-reduced-duration);
  }
}`);

  sections.push(`@media (forced-colors: active) {
  :root,
  [data-aura-scope] {
    --aura-focus-stroke: Highlight;
    --aura-focus-halo: transparent;
    --aura-color-focus-stroke: Highlight;
    --aura-color-focus-halo: transparent;
    --aura-border-control: CanvasText;
    --aura-color-border-control: CanvasText;
    --aura-color-brand-foreground: LinkText;
  }
}`);

  return `${sections.join("\n\n")}\n`;
}

function systemSelectors() {
  return [
    ':root[data-aura-theme="system"]:not([data-aura-brand])',
    "[data-aura-scope]:not([data-aura-theme]):not([data-aura-brand])",
    '[data-aura-scope][data-aura-theme="system"]:not([data-aura-brand])',
  ];
}

function systemBrandSelectors(brand) {
  const value = cssString(brand);
  return [
    `:root[data-aura-brand=${value}]:not([data-aura-theme])`,
    `:root[data-aura-brand=${value}][data-aura-theme="system"]`,
    `[data-aura-scope][data-aura-brand=${value}]:not([data-aura-theme])`,
    `[data-aura-scope][data-aura-brand=${value}][data-aura-theme="system"]`,
  ];
}

function explicitDefaultSelectors(mode) {
  const value = cssString(mode);
  return [
    `:root[data-aura-theme=${value}]:not([data-aura-brand])`,
    `[data-aura-scope][data-aura-theme=${value}]:not([data-aura-brand])`,
  ];
}

function explicitBrandSelectors(mode, brand) {
  const modeValue = cssString(mode);
  const brandValue = cssString(brand);
  return [
    `:root[data-aura-theme=${modeValue}][data-aura-brand=${brandValue}]`,
    `[data-aura-scope][data-aura-theme=${modeValue}][data-aura-brand=${brandValue}]`,
  ];
}

function renderCssBlock(selectors, set, mode, indentation = 0) {
  const prefix = " ".repeat(indentation);
  const declarationPrefix = `${prefix}  `;
  const selectorList = selectors.map((selector) => `${prefix}${selector}`).join(",\n");
  const declarations = Object.entries(set)
    .map(([name, token]) => `${declarationPrefix}${name}: ${token.css};`)
    .join("\n");
  return `${selectorList} {\n${declarationPrefix}color-scheme: ${mode};\n${declarations}\n${prefix}}`;
}

function createJavaScript(sets, commonJs, integrity) {
  const values = mapResolvedSets(sets, ({ css }) => css);
  const serializedValues = JSON.stringify(values, null, 2);
  const brands = JSON.stringify(auraBrands);
  const modes = JSON.stringify(themeModes);
  const banner = `// Generated from ${integrity}. Do not edit.`;
  const implementation = `const auraBrands = Object.freeze(${brands});
const themeModes = Object.freeze(${modes});
const themeTokenSets = deepFreeze(${serializedValues});

function getThemeTokens(mode, brand = "aura") {
  assertThemeMode(mode);
  assertAuraBrand(brand);
  return themeTokenSets[mode][brand];
}

function browserThemeColor(mode) {
  assertThemeMode(mode);
  return themeTokenSets[mode].aura["--aura-bg-app"];
}

function resolveThemePreference(preference, prefersDark = false) {
  if (preference === "system") {
    return prefersDark ? "dark" : "light";
  }
  assertThemeMode(preference);
  return preference;
}

function isThemeMode(value) {
  return themeModes.includes(value);
}

function isThemePreference(value) {
  return value === "system" || isThemeMode(value);
}

function isAuraBrand(value) {
  return auraBrands.includes(value);
}

function assertThemeMode(value) {
  if (!isThemeMode(value)) {
    throw new RangeError(\`Unsupported Aura theme mode: \${String(value)}\`);
  }
}

function assertAuraBrand(value) {
  if (!isAuraBrand(value)) {
    throw new RangeError(\`Unsupported Aura brand: \${String(value)}\`);
  }
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}`;

  if (commonJs) {
    return `${banner}\n"use strict";\n\n${implementation}\n\nmodule.exports = Object.freeze({ auraBrands, themeModes, getThemeTokens, browserThemeColor, resolveThemePreference, isThemeMode, isThemePreference, isAuraBrand });\n`;
  }
  return `${banner}\n${implementation}\n\nexport { auraBrands, themeModes, getThemeTokens, browserThemeColor, resolveThemePreference, isThemeMode, isThemePreference, isAuraBrand };\n`;
}

function createDeclarations() {
  const brandUnion = auraBrands.map((brand) => JSON.stringify(brand)).join(" | ");
  const modeUnion = themeModes.map((mode) => JSON.stringify(mode)).join(" | ");
  return `// Generated by @praabindh/aura-tokens. Do not edit.
export type ThemeMode = ${modeUnion};
export type ThemePreference = ThemeMode | "system";
export type AuraBrand = ${brandUnion};
export type AuraCssVariable = \`--aura-\${string}\`;
export type ThemeTokenMap = Readonly<Record<AuraCssVariable, string>>;

export declare const auraBrands: readonly AuraBrand[];
export declare const themeModes: readonly ThemeMode[];
export declare function getThemeTokens(mode: ThemeMode, brand?: AuraBrand): ThemeTokenMap;
export declare function browserThemeColor(mode: ThemeMode): string;
export declare function resolveThemePreference(preference: ThemePreference, prefersDark?: boolean): ThemeMode;
export declare function isThemeMode(value: unknown): value is ThemeMode;
export declare function isThemePreference(value: unknown): value is ThemePreference;
export declare function isAuraBrand(value: unknown): value is AuraBrand;
`;
}

function createAntThemeSets(sets) {
  return Object.fromEntries(
    themeModes.map((mode) => [
      mode,
      Object.fromEntries(
        auraBrands.map((brand) => {
          const set = sets[mode][brand];
          return [
            brand,
            {
              colorPrimary: set["--aura-brand-action"].css,
              colorPrimaryHover: set["--aura-brand-hover"].css,
              colorPrimaryActive: set["--aura-brand-active"].css,
              colorPrimaryText: set["--aura-brand-content"].css,
              colorBgBase: set["--aura-bg-app"].css,
              colorBgContainer: set["--aura-bg-surface"].css,
              colorBgElevated: set["--aura-bg-elevated"].css,
              colorText: set["--aura-text-primary"].css,
              colorTextSecondary: set["--aura-text-secondary"].css,
              colorTextDisabled: set["--aura-text-disabled"].css,
              colorBorder: set["--aura-border-decorative"].css,
              colorBorderSecondary: set["--aura-border-subtle"].css,
              colorError: set["--aura-status-danger-content"].css,
              colorWarning: set["--aura-status-warning-content"].css,
              colorSuccess: set["--aura-status-success-content"].css,
              colorInfo: set["--aura-status-info-content"].css,
              borderRadius: measurementNumber(set["--aura-radius-md"]),
              controlHeight: measurementNumber(set["--aura-size-control"]),
              fontFamily: set["--aura-font-sans"].css,
              fontSize: measurementNumber(set["--aura-font-size-body"]),
            },
          ];
        }),
      ),
    ]),
  );
}

function measurementNumber(token) {
  assert(
    token.type === "dimension" && token.value.unit === "px",
    "Ant numeric token must resolve to pixels.",
  );
  return token.value.value;
}

function mapResolvedSets(sets, mapper) {
  return Object.fromEntries(
    themeModes.map((mode) => [
      mode,
      Object.fromEntries(
        auraBrands.map((brand) => [
          brand,
          Object.fromEntries(
            Object.entries(sets[mode][brand]).map(([name, token]) => [
              name,
              mapper(token),
            ]),
          ),
        ]),
      ),
    ]),
  );
}

function checkGeneratedOutputs(outputs) {
  const errors = [];
  for (const [name, expected] of outputs) {
    const outputPath = join(outputDirectory, name);
    if (!existsSync(outputPath)) {
      errors.push(`${name} is missing`);
    } else if (readFileSync(outputPath, "utf8") !== expected) {
      errors.push(`${name} has drifted`);
    }
  }
  assert(
    errors.length === 0,
    `Generated artifact check failed: ${errors.join(", ")}. Run npm run build.`,
  );
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === ".git") {
      return [];
    }
    const filePath = join(directory, entry.name);
    return entry.isDirectory()
      ? walk(filePath)
      : statSync(filePath).isFile()
        ? [filePath]
        : [];
  });
}

function isAlias(value) {
  return /^\{[^{}]+\}$/u.test(value);
}

function isColor(value) {
  return (
    value &&
    typeof value === "object" &&
    value.colorSpace === "srgb" &&
    Array.isArray(value.components) &&
    value.components.length === 3 &&
    value.components.every(
      (component) => Number.isFinite(component) && component >= 0 && component <= 1,
    ) &&
    Number.isFinite(value.alpha) &&
    value.alpha >= 0 &&
    value.alpha <= 1
  );
}

function isMeasurement(value, units) {
  return (
    value &&
    typeof value === "object" &&
    Number.isFinite(value.value) &&
    units.includes(value.unit)
  );
}

function kebab(value) {
  return value
    .replace(/([a-z\d])([A-Z])/gu, "$1-$2")
    .replace(/[^a-zA-Z\d-]+/gu, "-")
    .toLowerCase();
}

function formatNumber(value) {
  return Number(value.toFixed(6)).toString();
}

function cssString(value) {
  return JSON.stringify(value);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
