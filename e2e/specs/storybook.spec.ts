import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const storyUrl = (id: string, globals = "brand:aura;theme:light"): string =>
  `/iframe.html?id=${id}&viewMode=story&globals=${globals}`;

async function expectNoSeriousA11yViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
}

async function waitForActiveAnimations(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });
}

const representativeCatalog = [
  {
    id: "primitives-actions-and-identity--identity-and-status",
    name: "primitives",
  },
  { id: "feedback-states-and-overlays--state-matrix", name: "feedback" },
  { id: "navigation-wayfinding--navigation-set", name: "navigation" },
  {
    id: "data-display-tables-and-values--package-inventory",
    name: "data display",
  },
  { id: "patterns-product-workflows--dashboard-cards", name: "patterns" },
  {
    id: "patterns-product-workflows--command-and-status-utilities",
    name: "command and status patterns",
  },
  {
    id: "layouts-responsive-workspaces--composition-primitives",
    name: "layouts",
  },
  {
    id: "layouts-responsive-workspaces--workspace-composition",
    name: "workspace layouts",
  },
  {
    id: "templates-product-neutral-surfaces--authentication",
    name: "templates",
  },
  {
    id: "templates-product-neutral-surfaces--conversation",
    name: "conversation template",
  },
  {
    id: "optional-packages-rich-content--long-form-reader",
    name: "rich content",
  },
] as const;

test.describe("PADS Storybook", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("renders semantic color foundations in every deterministic theme", async ({
    page,
  }) => {
    await page.goto(storyUrl("foundations-palette--semantic-colors"));
    await expect(
      page.getByRole("heading", { name: "Semantic color system" }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-aura-theme", "light");

    await page.goto(
      storyUrl("foundations-palette--semantic-colors", "brand:cognaura;theme:dark"),
    );
    await expect(page.locator("html")).toHaveAttribute("data-aura-brand", "cognaura");
    await expect(page.locator("html")).toHaveAttribute("data-aura-theme", "dark");
    await expectNoSeriousA11yViolations(page);
  });

  test("operates the segmented control with the keyboard", async ({ page }) => {
    await page.goto(storyUrl("forms-fields-and-choices--complete-form"));
    const balanced = page.getByRole("radio", { name: "Balanced" });
    await balanced.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Strong" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expectNoSeriousA11yViolations(page);
  });

  test("keeps the application shell usable at a 320px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(storyUrl("layouts-responsive-workspaces--application-shell"));
    await expect(
      page.getByRole("button", { name: "Open primary navigation" }),
    ).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    const hasUnexpectedPageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasUnexpectedPageOverflow).toBe(false);
  });

  test("exposes chart values without relying on color", async ({ page }) => {
    await page.goto(storyUrl("optional-packages-charts--usage-dashboard"));
    await expect(
      page.getByRole("img", { name: "Weekly writing activity" }),
    ).toBeAttached();
    await expect(
      page.getByRole("table", { name: "Weekly writing activity" }),
    ).toBeAttached();
    await expectNoSeriousA11yViolations(page);
  });

  test("keeps the scoped theme runtime operable", async ({ page }) => {
    await page.goto(storyUrl("foundations-typography-and-space--theme-runtime"));
    const toggle = page.getByRole("button", { name: "Use dark theme" });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole("button", { name: "Use light theme" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("opens and filters the command palette accessibly", async ({ page }) => {
    await page.goto(
      storyUrl("patterns-product-workflows--command-and-status-utilities"),
    );
    await page.getByRole("button", { name: "Open command palette" }).click();
    await expect(
      page.getByRole("dialog", { name: "Workspace commands" }),
    ).toBeVisible();
    await page.getByRole("searchbox", { name: "Search commands" }).fill("library");
    await expect(page.getByRole("option", { name: /Search library/ })).toBeVisible();
    await waitForActiveAnimations(page);
    await expectNoSeriousA11yViolations(page);
  });

  test.describe("representative catalog accessibility", () => {
    test.skip(
      ({ browserName }) => browserName !== "chromium",
      "The complete catalog scan runs once; core interactions remain cross-browser.",
    );

    for (const story of representativeCatalog) {
      test(`${story.name} has no WCAG 2.2 AA violations`, async ({ page }) => {
        await page.goto(storyUrl(story.id));
        await expect(page.locator(".docsCanvas")).toBeVisible();
        await expectNoSeriousA11yViolations(page);
      });
    }
  });
});
