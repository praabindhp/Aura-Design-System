import { expect, type Page } from "@playwright/test";

const labels: Record<string, string> = {
  aura: "Aura",
  verbaura: "VerbAura",
  cognaura: "CognAura",
  rendaura: "RendAura",
  charteraura: "CharterAura",
  dark: "Dark",
  light: "Light",
  system: "System",
};

export async function chooseAppearance(
  page: Page,
  label: "Brand" | "Theme",
  value: string,
) {
  const optionLabel = labels[value];
  if (!optionLabel) throw new Error(`Unknown appearance: ${value}`);
  await chooseOption(page, label, optionLabel);
}

async function chooseOption(page: Page, label: string, option: string) {
  const control = page.getByRole("combobox", { name: label, exact: true });
  await control.click();
  const listId = await control.getAttribute("aria-controls");
  await page.getByRole("option", { name: option, exact: true }).click();
  await expect(control).toHaveAttribute("aria-expanded", "false");
  if (listId) await expect(page.locator(`[id="${listId}"]`)).toBeHidden();
}
