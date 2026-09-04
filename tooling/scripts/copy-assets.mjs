import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

const packageDirectory = process.argv[2];
if (!packageDirectory?.startsWith("packages/")) {
  throw new Error("Usage: node tooling/scripts/copy-assets.mjs packages/<name>");
}

const source = path.resolve(packageDirectory, "src");
const destination = path.resolve(packageDirectory, "dist");
await mkdir(destination, { recursive: true });

await cp(source, destination, {
  recursive: true,
  filter: (entry) =>
    !entry.endsWith(".ts") &&
    !entry.endsWith(".tsx") &&
    !entry.includes(".test.") &&
    !entry.includes(".stories."),
});
