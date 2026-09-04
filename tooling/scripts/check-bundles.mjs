import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const budgets = [
  {
    label: "React package JS + CSS",
    path: "packages/react/dist",
    raw: 140_000,
    gzip: 25_000,
  },
  {
    label: "Charts package JS + CSS",
    path: "packages/charts/dist",
    raw: 36_000,
    gzip: 8_000,
  },
  {
    label: "Rich-content package JS + CSS",
    path: "packages/rich-content/dist",
    raw: 28_000,
    gzip: 8_000,
  },
  {
    label: "Token runtime",
    path: "packages/tokens/dist/index.js",
    raw: 135_000,
    gzip: 8_000,
  },
  {
    label: "Token stylesheet",
    path: "packages/tokens/dist/tokens.css",
    raw: 270_000,
    gzip: 12_000,
  },
];

const readRuntimeFiles = async (path) => {
  const entries = await readdir(path, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .sort((left, right) => left.name.localeCompare(right.name))
      .map(async (entry) => {
        const target = join(path, entry.name);
        if (entry.isDirectory()) return readRuntimeFiles(target);
        return /\.(css|js)$/.test(entry.name) ? [await readFile(target)] : [];
      }),
  );
  return files.flat();
};

let failed = false;
for (const budget of budgets) {
  const contents = (await readFile(budget.path).catch(() => undefined))
    ? [await readFile(budget.path)]
    : await readRuntimeFiles(budget.path);
  const combined = Buffer.concat(contents);
  const rawSize = combined.byteLength;
  const gzipSize = gzipSync(combined, { level: 9 }).byteLength;
  const passed = rawSize <= budget.raw && gzipSize <= budget.gzip;
  console.log(
    `${passed ? "PASS" : "FAIL"} ${budget.label}: ${rawSize}/${budget.raw} raw; ${gzipSize}/${budget.gzip} gzip bytes`,
  );
  failed ||= !passed;
}

if (failed) process.exitCode = 1;
