import { expect, test, type Page } from "@playwright/test";

const storyUrl = (id: string, globals = "brand:aura;theme:light"): string =>
  `/iframe.html?id=${id}&viewMode=story&globals=${globals}`;

async function loadStableStory(
  page: Page,
  {
    colorScheme,
    globals,
    id,
    viewport,
  }: {
    readonly colorScheme: "dark" | "light";
    readonly globals?: string;
    readonly id: string;
    readonly viewport: { readonly height: number; readonly width: number };
  },
): Promise<void> {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
  await page.goto(storyUrl(id, globals));
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  await expect(page.locator(".docsCanvas")).toBeVisible();
}

const visualOptions = {
  animations: "disabled",
  caret: "hide",
  maxDiffPixelRatio: 0.02,
  scale: "css",
  threshold: 0.25,
} as const;

test.describe("PADS deterministic visual surfaces", () => {
  test("dashboard cards · light", async ({ page }) => {
    await loadStableStory(page, {
      colorScheme: "light",
      id: "patterns-product-workflows--dashboard-cards",
      viewport: { width: 960, height: 720 },
    });

    await expect(page.locator(".docsCanvas")).toHaveScreenshot(
      "dashboard-cards-light.png",
      visualOptions,
    );
  });

  test("dashboard cards · dark", async ({ page }) => {
    await loadStableStory(page, {
      colorScheme: "dark",
      globals: "brand:cognaura;theme:dark",
      id: "patterns-product-workflows--dashboard-cards",
      viewport: { width: 960, height: 720 },
    });

    await expect(page.locator(".docsCanvas")).toHaveScreenshot(
      "dashboard-cards-dark.png",
      visualOptions,
    );
  });

  test("application shell · 320px", async ({ page }) => {
    await loadStableStory(page, {
      colorScheme: "light",
      id: "layouts-responsive-workspaces--application-shell",
      viewport: { width: 320, height: 720 },
    });

    await expect(page.locator(".docsCanvas")).toHaveScreenshot(
      "application-shell-320.png",
      visualOptions,
    );
  });
});
