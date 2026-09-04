import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const violations = [];

for await (const file of glob("{packages,apps}/**/*.{ts,tsx,css}", {
  exclude: [
    "**/coverage/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/storybook-static/**",
    "**/test-results/**",
  ],
})) {
  const source = await readFile(file, "utf8");
  if (
    /from\s+["']antd(?:\/[^"]*)?["']/.test(source) &&
    !file.includes("packages/react/src/internal/")
  ) {
    violations.push(
      `${file}: Ant Design imports belong in packages/react/src/internal only.`,
    );
  }
  if (/#[0-9a-f]{3,8}\b/i.test(source) && !file.includes("packages/tokens/")) {
    violations.push(`${file}: raw colors belong in the canonical token source.`);
  }
  if (/!important\b/.test(source)) {
    violations.push(`${file}: !important is forbidden.`);
  }
}

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Architecture boundaries are clean.");
}
