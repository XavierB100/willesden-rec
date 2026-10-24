import { expectAccessible } from "./accessibility";
import { expect, test, type Page } from "@playwright/test";
import { DEFAULT_SITE_SETTINGS, type Product } from "../../src/lib/catalogue";

// Only these tests intercept Auth/API calls. No fixture login or bypass exists in the app.
const seed: Product = {
  id: "browser-fixture",
  title: "Victorian fireplace",
  slug: "browser-fixture",
  category: "Fireplaces",
  price: 250.5,
  description: "Fictional browser test listing.",
  status: "available",
  imageUrls: [
    "/review-stock/fireplaces-1-portrait.webp",
    "/review-stock/fireplaces-2-portrait.webp",
  ],
  dimensions: "H: 100 cm",
};
async function workspace(page: Page) {
  let products = [{ ...seed }];
  let settings = structuredClone(DEFAULT_SITE_SETTINGS);
  let rejectSave = false;
  const subject = "00000000-0000-4000-8000-000000000001";
  const jwt =
    [
      { alg: "HS256", typ: "JWT" },
      { sub: subject, exp: Math.floor(Date.now() / 1000) + 3600 },
    ]
      .map((p) => Buffer.from(JSON.stringify(p)).toString("base64url"))
      .join(".") + ".fixture";
  await page.route("**/auth/v1/**", async (route) => {
    await route.fulfill({
      json: {
        access_token: jwt,
        refresh_token: "fixture-refresh",
        token_type: "bearer",
        expires_in: 3600,
        user: {
          id: subject,
          email: "owner@example.test",
          aud: "authenticated",
          role: "authenticated",
          app_metadata: { provider: "email" },
          user_metadata: {},
          created_at: new Date().toISOString(),
        },
      },
    });
  });
  await page.route("**/api/admin/**", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.pathname.endsWith("settings")) {
      if (req.method() === "PUT") settings = req.postDataJSON();
      return route.fulfill({ json: { settings } });
    }
    if (url.pathname.endsWith("uploads"))
      return route.fulfill({
        json: { url: "/review-stock/fireplaces-3-portrait.webp" },
      });
    if (req.method() === "GET") return route.fulfill({ json: { products } });
    if (rejectSave)
      return route.fulfill({
        status: 503,
        json: { error: "Could not save. Please try again." },
      });
    const id = url.pathname.split("/").at(-1);
    if (req.method() === "DELETE") {
      products = products.filter((p) => p.id !== id);
      return route.fulfill({ json: { success: true } });
    }
    const product = {
      ...req.postDataJSON(),
      id: req.method() === "POST" ? "new-fixture" : id,
    };
    products =
      req.method() === "POST"
        ? [product, ...products]
        : products.map((p) => (p.id === id ? product : p));
    return route.fulfill({
      status: req.method() === "POST" ? 201 : 200,
      json: { product },
    });
  });
  await page.goto("/admin");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("owner@example.test");
  await page.getByLabel("Password", { exact: true }).fill("test-only-password");
  await page.getByRole("button", { name: "Sign in to your workspace" }).click();
  await expect(page.locator(".inventory-row")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Add a product", exact: true }).last(),
  ).toBeEnabled();
  return {
    failSave: () => {
      rejectSave = true;
    },
    allowSave: () => {
      rejectSave = false;
    },
    products: () => products,
    settings: () => settings,
  };
}

test("draft survives section changes, failed saves and cancelled discard", async ({
  page,
}) => {
  const api = await workspace(page);
  await page
    .getByRole("button", { name: "Edit Victorian fireplace", exact: true })
    .click();
  await page
    .getByLabel("Product title *", { exact: true })
    .fill("Updated fireplace");
  await page.getByRole("button", { name: "Yard details", exact: true }).click();
  await page.getByRole("button", { name: /^Product editor/ }).click();
  await expect(page.getByLabel("Product title *", { exact: true })).toHaveValue(
    "Updated fireplace",
  );
  api.failSave();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.locator(".admin-feedback[role=alert]")).toContainText(
    "Could not save",
  );
  await expect(page.getByLabel("Product title *", { exact: true })).toHaveValue(
    "Updated fireplace",
  );
  page.once("dialog", (d) => d.dismiss());
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByLabel("Product title *", { exact: true })).toHaveValue(
    "Updated fireplace",
  );
  api.allowSave();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.locator(".admin-feedback")).toContainText(
    "Product updated",
  );
  expect(api.products()[0].title).toBe("Updated fireplace");
});

test("create, mark sold, edit and delete update the inventory", async ({
  page,
}) => {
  const api = await workspace(page);
  await page
    .getByRole("button", { name: "Add a product", exact: true })
    .last()
    .click();
  await page
    .getByLabel("Product title *", { exact: true })
    .fill("Old pine door");
  await page
    .getByLabel("Description *", { exact: true })
    .fill("Fictional test piece.");
  await page.getByLabel("Price (£)", { exact: true }).fill("123.45");
  await page
    .getByRole("button", { name: "Publish product", exact: true })
    .click();
  await expect(page.locator(".admin-feedback")).toContainText("Product added");
  expect(api.products()[0].price).toBe(123.45);
  await page
    .getByRole("button", { name: "Back to inventory", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Mark Old pine door sold", exact: true })
    .click();
  await expect(
    page
      .locator(".inventory-row")
      .filter({ hasText: "Old pine door" })
      .locator(".status-badge"),
  ).toHaveText("Sold");
  await page
    .getByRole("button", { name: "Edit Old pine door", exact: true })
    .click();
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Delete product", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Inventory", exact: true }),
  ).toBeVisible();
  expect(api.products()).toHaveLength(1);
});

test("cover ordering, removal and upload retain unsaved photos", async ({
  page,
}) => {
  await workspace(page);
  await page
    .getByRole("button", { name: "Edit Victorian fireplace", exact: true })
    .click();
  await page.getByRole("button", { name: "Make cover", exact: true }).click();
  await expect(
    page.locator(".photo-tile").first().locator("img"),
  ).toHaveAttribute("src", /fireplaces-2-portrait/);
  await page
    .getByRole("button", { name: "Remove photo 2", exact: true })
    .click();
  await expect(page.locator(".photo-tile")).toHaveCount(1);
  await page
    .locator('input[type="file"]')
    .setInputFiles("public/review-stock/fireplaces-3-portrait.webp");
  await expect(page.locator(".photo-tile")).toHaveCount(2);
  await expect(page.locator(".editor-savebar")).toContainText(
    "unsaved changes",
  );
});

test("opening hours are saved as structured rows, preserving colon times", async ({
  page,
}) => {
  const api = await workspace(page);
  await page.getByRole("button", { name: "Yard details", exact: true }).click();
  await page.getByLabel("Hours 1", { exact: true }).fill("9:30 AM – 5:00 PM");
  await page.getByRole("button", { name: "Add hours", exact: true }).click();
  await page.getByLabel("Days 4", { exact: true }).fill("Bank holidays");
  await page.getByLabel("Hours 4", { exact: true }).fill("Call first");
  await page
    .getByRole("button", { name: "Save yard details", exact: true })
    .click();
  await expect(page.locator(".admin-feedback")).toContainText(
    "Site settings saved",
  );
  expect(api.settings().openingHours[0].value).toBe("9:30 AM – 5:00 PM");
  expect(api.settings().openingHours[3]).toEqual({
    label: "Bank holidays",
    value: "Call first",
  });
});

test("workspace screens fit narrow phones, tablets and desktop", async ({
  page,
}) => {
  await workspace(page);
  for (const view of ["Inventory", "Add a product", "Yard details"]) {
    await page
      .getByRole("navigation", { name: "Workspace sections" })
      .getByRole("button", { name: view, exact: false })
      .click();
    await expectAccessible(page, view);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${view} at ${width}px`,
      ).toBe(true);
    }
  }
});
