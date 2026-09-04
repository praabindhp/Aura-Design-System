import { rm } from "node:fs/promises";
import { glob } from "node:fs/promises";

const patterns = [
  "apps/*/dist",
  "apps/*/storybook-static",
  "packages/*/dist",
  "coverage",
  "playwright-report",
  "test-results",
];

for (const pattern of patterns) {
  for await (const path of glob(pattern)) {
    await rm(path, { force: true, recursive: true });
  }
}
