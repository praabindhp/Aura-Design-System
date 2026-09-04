import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";

const workspacePath = (relativePath: string): string =>
  fileURLToPath(new URL(relativePath, import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: (baseConfig) =>
    mergeConfig(baseConfig, {
      resolve: {
        alias: [
          {
            find: "@praabindh/aura-design-system/styles.css",
            replacement: workspacePath("../../../packages/react/src/styles/index.css"),
          },
          {
            find: /^@praabindh\/aura-design-system$/,
            replacement: workspacePath("../../../packages/react/src/index.ts"),
          },
          {
            find: /^@praabindh\/aura-charts$/,
            replacement: workspacePath("../../../packages/charts/src/index.ts"),
          },
          {
            find: /^@praabindh\/aura-rich-content$/,
            replacement: workspacePath("../../../packages/rich-content/src/index.ts"),
          },
        ],
      },
    }),
};

export default config;
