import { expect, test } from "@playwright/test";
import { expectAccessible } from "./accessibility";

test("public routes fit phones and desktop with no automated WCAG A/AA violations", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const path of [
    "/",
    "/stock",
    "/fireplaces",
    "/doors",
    "/windows",
    "/selling",
    "/contact",
    "/admin",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
    }
    await expectAccessible(page, path);
  }
});

test("instant search preserves the applied sort until Apply is pressed", async ({
  page,
}) => {
  await page.goto("/stock");
  await expect(page.locator(".product-card").first()).toBeVisible();
  const title = await page.locator(".product-card h3").first().innerText();
  await page.getByLabel("Sort by", { exact: true }).selectOption("price-desc");
  await page
    .getByRole("searchbox", { name: "Search stock", exact: true })
    .fill(title);
  await page
    .getByRole("searchbox", { name: "Search stock", exact: true })
    .press("Enter");
  expect(new URL(page.url()).searchParams.get("sort")).not.toBe("price-desc");
  await expect(page.locator(".product-card").first()).toContainText(title);
  await page.getByRole("button", { name: "Apply sort order" }).click();
  await expect(page).toHaveURL(/sort=price-desc/);
  await page.getByRole("link", { name: "Clear search", exact: true }).click();
  expect(new URL(page.url()).searchParams.get("q")).toBeNull();
  expect(new URL(page.url()).searchParams.get("sort")).toBe("price-desc");
});

test("mobile navigation and full-screen gallery restore keyboard focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.locator("#mobile-navigation")).toHaveAttribute(
    "data-open",
    "true",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open menu", exact: true }),
  ).toBeFocused();
  await page.goto("/stock");
  await page
    .locator(".product-card")
    .first()
    .getByRole("link", { name: "View Details", exact: true })
    .click();
  const opener = page.getByRole("button", {
    name: "View product photo full screen",
    exact: true,
  });
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(opener).toBeFocused();
});
