import {
  AuraProvider,
  type AuraBrand,
  type ThemePreference,
} from "@praabindh/aura-design-system";
import { auraBrands, isAuraBrand, isThemePreference } from "@praabindh/aura-tokens";
import type { Preview } from "@storybook/react-vite";
import type { ReactElement } from "react";
import "@praabindh/aura-design-system/styles.css";
import "../src/docs.css";

const brandTitles: Readonly<Record<AuraBrand, string>> = {
  aura: "Aura",
  verbaura: "VerbAura",
  cognaura: "CognAura",
  rendaura: "RendAura",
  charteraura: "CharterAura",
  "charteraura-intermediate": "CharterAura Intermediate",
};

const preview: Preview = {
  tags: ["autodocs"],
  initialGlobals: {
    brand: "aura",
    theme: "light",
  },
  globalTypes: {
    brand: {
      description: "Aura brand recipe",
      toolbar: {
        icon: "paintbrush",
        dynamicTitle: true,
        items: auraBrands.map((brand) => ({
          value: brand,
          title: brandTitles[brand],
        })),
      },
    },
    theme: {
      description: "Resolved color theme",
      toolbar: {
        icon: "mirror",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  decorators: [
    (Story, context): ReactElement => {
      const brand = isAuraBrand(context.globals.brand) ? context.globals.brand : "aura";
      const theme: ThemePreference = isThemePreference(context.globals.theme)
        ? context.globals.theme
        : "light";
      const fullscreen = context.parameters.layout === "fullscreen";
      const embedded =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("embed") === "1";
      const canvasClassName = [
        fullscreen ? "docsCanvas docsCanvasFull" : "docsCanvas",
        embedded ? "docsCanvasEmbedded" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <AuraProvider brand={brand} storageKey={null} theme={theme}>
          <div className={canvasClassName}>
            <Story />
          </div>
        </AuraProvider>
      );
    },
  ],
  parameters: {
    a11y: {
      test: "error",
    },
    controls: {
      expanded: true,
      sort: "requiredFirst",
    },
    docs: {
      canvas: {
        sourceState: "shown",
      },
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          "Primitives",
          "Forms",
          "Feedback",
          "Navigation",
          "Data display",
          "Patterns",
          "Layouts",
          "Templates",
          "Optional packages",
        ],
      },
    },
    viewport: {
      options: {
        mobile: {
          name: "Mobile · 320px",
          styles: { width: "320px", height: "720px" },
          type: "mobile",
        },
        compact: {
          name: "Compact · 375px",
          styles: { width: "375px", height: "812px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet · 768px",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop · 1440px",
          styles: { width: "1440px", height: "1000px" },
          type: "desktop",
        },
      },
    },
  },
};

export default preview;
