import { expect, test } from "@playwright/test";

const site = "http://127.0.0.1:4174/Aura-Design-System/";

for (const theme of ["light", "dark"] as const) {
  test(`PADS showcase · ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await page.goto(site);
    await page.getByLabel("Theme", { exact: true }).selectOption(theme);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`showcase-${theme}.png`, {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  });
}

test("PADS component explorer · narrow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${site}#/components`);
  await page.getByRole("searchbox", { name: "Find a component" }).fill("Button");
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("component-explorer-narrow.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.01,
  });
});
