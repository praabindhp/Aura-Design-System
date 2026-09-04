import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    css: true,
    setupFiles: "./tooling/test-setup.ts",
    include: ["packages/**/*.test.{ts,tsx}"],
    maxWorkers: 2,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["packages/*/src/**/*.{ts,tsx}"],
      exclude: [
        "packages/**/*.test.{ts,tsx}",
        "packages/**/*.stories.tsx",
        "packages/**/index.ts",
        "packages/testing/**",
        "packages/tokens/src/generated/**",
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
