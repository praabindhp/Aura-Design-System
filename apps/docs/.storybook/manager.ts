import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

addons.setConfig({
  theme: create({
    base: "dark",
    brandTitle: "PADS · PRAABINDH CORP",
    brandUrl: "/",
    colorPrimary: "#9D94F4",
    colorSecondary: "#786FE1",
    appBg: "#08090B",
    appContentBg: "#101216",
    appPreviewBg: "#08090B",
    appBorderColor: "#262A31",
    barBg: "#101216",
    textColor: "#F3F4F6",
    textMutedColor: "#A6ACB7",
  }),
});
