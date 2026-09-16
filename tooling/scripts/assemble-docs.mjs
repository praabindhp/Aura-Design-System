import assert from "node:assert/strict";
import { cpSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
const catalogSource = readFileSync("apps/docs/src/showcase/catalog.ts", "utf8");
const { outputText } = ts.transpileModule(catalogSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { catalog, utilities } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const entries = [
  "packages/react/src/index.ts",
  "packages/charts/src/index.ts",
  "packages/rich-content/src/index.ts",
];
const program = ts.createProgram(entries, {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  skipLibCheck: true,
  noEmit: true,
});
const checker = program.getTypeChecker();
const exportedValues = entries.flatMap((file) => {
  const source = program.getSourceFile(file);
  assert(source, `Missing source: ${file}`);
  const symbol = checker.getSymbolAtLocation(source);
  assert(symbol, `Missing public exports: ${file}`);
  return checker
    .getExportsOfModule(symbol)
    .filter((item) => {
      const target =
        item.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(item) : item;
      return Boolean(target.flags & ts.SymbolFlags.Value);
    })
    .map((item) => item.name);
});
const catalogNames = catalog.map((item) => item.name);
assert.equal(
  new Set(catalogNames).size,
  catalogNames.length,
  "Duplicate component in the catalog",
);
assert.deepEqual(
  [...catalogNames, ...utilities].sort(),
  exportedValues.sort(),
  "Catalog and runtime helpers must cover exactly the public exports",
);
const stories = JSON.parse(
  readFileSync("apps/docs/storybook-static/index.json", "utf8"),
).entries;
for (const entry of catalog)
  assert(
    stories[entry.story],
    `Missing Storybook example for ${entry.name}: ${entry.story}`,
  );
assert(stories["introduction-welcome--design-system"], "Missing introduction story");
cpSync("apps/docs/storybook-static", "apps/docs/dist/storybook", { recursive: true });
writeFileSync("apps/docs/dist/.nojekyll", "");
// A friendly recovery page for mistyped URLs. Hash routes themselves never need fallback rewrites.
writeFileSync(
  "apps/docs/dist/404.html",
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · PADS</title><h1>This page is not in the library.</h1><p>Return to the PADS showcase at your GitHub Pages site root and browse the components.</p></html>\n',
);
console.log(
  `Assembled ${resolve("apps/docs/dist")}: ${catalog.length} components, ${utilities.length} runtime helpers, all Storybook links verified.`,
);
