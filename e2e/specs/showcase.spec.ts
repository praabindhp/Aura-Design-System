import { chooseAppearance } from "../helpers/appearance";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { catalog } from "../../apps/docs/src/showcase/catalog";

const site = "http://127.0.0.1:4174/Aura-Design-System/";

test.describe("PADS public showcase", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(site);
  });

  test("runs local examples and preserves appearance on reload", async ({ page }) => {
    await page.getByRole("textbox", { name: "Workspace name" }).fill("A new idea");
    await page.getByRole("button", { name: "Create workspace" }).click();
    await expect(page.getByText("A new idea is ready")).toBeVisible();
    await page.getByRole("switch", { name: "Weekly digest", exact: true }).click();
    await page.getByRole("button", { name: "Save preferences" }).click();
    await expect(page.getByRole("button", { name: "Preferences saved" })).toBeVisible();
    await page
      .getByRole("textbox", { name: "Message", exact: true })
      .fill("Hello Aura");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Message sent in this local demo.")).toBeVisible();
    await chooseAppearance(page, "Brand", "cognaura");
    await chooseAppearance(page, "Theme", "light");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-aura-brand", "cognaura");
    await expect(page.locator("html")).toHaveAttribute("data-aura-theme", "light");
  });

  test("covers the library, filters, recovers from no matches, and opens a deep link", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "Explore components", exact: true }).click();
    await expect(
      page.getByRole("status").filter({ hasText: `${catalog.length} components` }),
    ).toBeVisible();
    const search = page.getByRole("searchbox", { name: "Find a component" });
    await search.fill("button");
    await expect(
      page.getByRole("heading", { name: "IconButton", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: /^Charts/ }).click();
    await expect(
      page.getByRole("heading", { name: "A little too specific?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await search.fill("Dialog");
    await page
      .getByRole("heading", { name: "Dialog", exact: true })
      .getByRole("link")
      .click();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Dialog", exact: true }),
    ).toBeVisible();
    const frame = page.locator('iframe[title="Dialog Storybook example"]');
    await frame.scrollIntoViewIfNeeded();
    const canvas = frame.contentFrame();
    await expect(
      canvas.getByRole("heading", { name: "Contextual layers with predictable focus" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Open dialog", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "A space for your next idea" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("dialog", { name: "A space for your next idea" }),
    ).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Open dialog", exact: true }),
    ).toBeFocused();
  });

  test("has usable empty, error, loading, and destructive examples", async ({
    page,
  }) => {
    await page.goto(`${site}#/components/ErrorState`);
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByText("Connection restored")).toBeVisible();
    await page.goto(`${site}#/components/Confirm`);
    await expect(
      page.getByRole("heading", { name: "Confirm", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Recovered", { exact: true })).toBeHidden();
    await page.getByRole("button", { name: "Remove example", exact: true }).click();
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(page.getByText("Remove the example?", { exact: true })).toBeHidden();
    await expect(page.getByText("Example removed", { exact: true })).toBeHidden();
    await page.getByRole("button", { name: "Remove example", exact: true }).click();
    await page
      .getByRole("tooltip")
      .getByRole("button", { name: "Remove example", exact: true })
      .click();
    await expect(page.getByText("Example removed", { exact: true })).toBeVisible();
    await page.goto(`${site}#/components/LoadingState`);
    await expect(
      page.getByRole("status", { name: "Gathering your workspace" }),
    ).toBeVisible();
  });

  test("supports system appearance and keyboard segmented choices", async ({
    page,
  }) => {
    const design = page.getByRole("radio", { name: "Design", exact: true });
    await design.focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("radio", { name: "Build", exact: true }),
    ).toHaveAttribute("aria-checked", "true");
    await chooseAppearance(page, "Theme", "system");
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).toHaveAttribute("data-aura-theme", "light");
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveAttribute("data-aura-theme", "dark");
  });

  test("reflows at narrow widths and a 200 percent zoom equivalent", async ({
    page,
  }) => {
    for (const width of [320, 375, 640, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["", "#/components", "#/foundations", "#/start"]) {
        await page.goto(`${site}${path}`);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth >
              document.documentElement.clientWidth,
          ),
          `${path} overflows at ${width}px`,
        ).toBe(false);
      }
    }
  });

  test("keeps keyboard focus visible in forced colors", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Forced colors are checked in Chromium.");
    await page.emulateMedia({ forcedColors: "active" });
    const explore = page.getByRole("link", { name: "Explore components", exact: true });
    await explore.focus();
    await expect(explore).toBeFocused();
    await expect(explore).toHaveCSS("outline-style", "solid");
    await page.screenshot({ path: test.info().outputPath("forced-colors-focus.png") });
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "A place for every piece." }),
    ).toBeVisible();
  });

  test("keeps all brands and themes accessible", async ({ page, browserName }) => {
    test.setTimeout(120_000);
    test.skip(
      browserName !== "chromium",
      "The full appearance matrix runs once; interactions run in all engines.",
    );
    for (const brand of [
      "aura",
      "verbaura",
      "cognaura",
      "rendaura",
      "charteraura",
      "charteraura-intermediate",
    ]) {
      await chooseAppearance(page, "Brand", brand);
      for (const theme of ["light", "dark"]) {
        await chooseAppearance(page, "Theme", theme);
        await expect(page.locator("html")).toHaveAttribute("data-aura-theme", theme);
        await page.evaluate(async () => {
          await Promise.all(
            document
              .getAnimations()
              .map((animation) => animation.finished.catch(() => undefined)),
          );
        });
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(result.violations, `${brand} ${theme}`).toEqual([]);
        await page.screenshot({
          path: test.info().outputPath(`${brand}-${theme}.png`),
          fullPage: true,
        });
        await page.getByRole("combobox", { name: "Brand", exact: true }).click();
        await page.evaluate(async () => {
          await Promise.all(
            document
              .getAnimations()
              .map((animation) => animation.finished.catch(() => undefined)),
          );
        });
        const menuResult = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(menuResult.violations, `${brand} ${theme} open menu`).toEqual([]);
        await page.keyboard.press("Escape");
      }
    }
    await page.goto(`${site}#/components`);
    await expect(
      page.getByRole("heading", { name: "A place for every piece." }),
    ).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
});

test("appearance uses styled menus, groups CharterAura modes, and preserves keyboard focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(site);
  const brand = page.getByRole("combobox", { name: "Brand", exact: true });
  await brand.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await expect(page.getByRole("option")).toHaveCount(5);
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });
  const openMenu = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(openMenu.violations).toEqual([]);
  await expect(
    page.getByRole("option", { name: "CharterAura Intermediate", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(brand).toHaveAttribute("aria-expanded", "false");
  await expect(brand).toBeFocused();
  await chooseAppearance(page, "Brand", "charteraura-intermediate");
  await expect(page.locator("html")).toHaveAttribute(
    "data-aura-brand",
    "charteraura-intermediate",
  );
  await expect(page.getByRole("combobox", { name: "CharterAura mode" })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 700 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(320);
  await page.getByRole("combobox", { name: "CharterAura mode" }).click();
  await expect(
    page.getByRole("option", { name: "Intermediate", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-aura-brand",
    "charteraura-intermediate",
  );
  await chooseAppearance(page, "Brand", "aura");
  await expect(page.getByRole("combobox", { name: "CharterAura mode" })).toHaveCount(0);
  for (const theme of ["light", "dark"]) {
    await chooseAppearance(page, "Theme", theme);
    await expect(page.locator("html")).toHaveAttribute("data-aura-theme", theme);
    const action = await page
      .locator("html")
      .evaluate((element) =>
        getComputedStyle(element).getPropertyValue("--aura-brand-action").trim(),
      );
    const expanded =
      action.length === 4
        ? `#${[...action.slice(1)].map((digit) => digit.repeat(2)).join("")}`
        : action;
    const channels = [1, 3, 5].map((index) =>
      Number.parseInt(expanded.slice(index, index + 2), 16),
    );
    expect(channels[0]! > channels[1]! && channels[1]! > channels[2]!).toBe(true);
  }
});

test("text controls show one focus boundary with no halo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(site);
  for (const label of ["Workspace name", "A few words about it"]) {
    const field = page.getByRole("textbox", { name: label, exact: true });
    await field.click();
    await expect(field).toBeFocused();
    await expect(field).toHaveCSS("box-shadow", "none");
    await expect(field).toHaveCSS("outline-style", "solid");
    await expect(field).toHaveCSS(
      "border-color",
      await field.evaluate((node) => getComputedStyle(node).outlineColor),
    );
    const boundary = await field.evaluate((node) => {
      const css = getComputedStyle(node);
      return {
        width: css.outlineWidth,
        offset: css.outlineOffset,
        border: css.borderColor,
        outline: css.outlineColor,
      };
    });
    expect(Number.parseFloat(boundary.offset)).toBe(-Number.parseFloat(boundary.width));
    expect(boundary.border).toBe(boundary.outline);
  }
});
