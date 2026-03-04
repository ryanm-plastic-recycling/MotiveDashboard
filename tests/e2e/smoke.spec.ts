import { test, expect } from "@playwright/test";

test("dashboard smoke", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Transportation Dashboard")).toBeVisible();
  await page.getByLabel("Search").fill("LD-");
  await page.waitForTimeout(300);
  const row = page.locator("tbody tr").first();
  await row.click();
  await expect(page.getByText("Open full details")).toBeVisible();
});
