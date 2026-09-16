import { chooseAppearance } from "../helpers/appearance";
import { expect, test } from "@playwright/test";

const site = "http://127.0.0.1:4174/Aura-Design-System/";

for (const theme of ["light", "dark"] as const) {
  test(`PADS showcase · ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await page.goto(site);
    await chooseAppearance(page, "Theme", theme);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`showcase-${theme}.png`, {
      fullPage: true,
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`Aura gold showcase · ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await page.goto(site);
    await chooseAppearance(page, "Brand", "aura");
    await chooseAppearance(page, "Theme", theme);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => undefined)),
      );
    });
    await page.getByRole("combobox", { name: "Brand", exact: true }).click();
    await expect(
      page.getByRole("option", { name: "Aura", exact: true }),
    ).toBeInViewport();
    await expect(page).toHaveScreenshot(`aura-appearance-${theme}.png`, {
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
