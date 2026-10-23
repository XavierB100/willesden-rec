import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { PRODUCT_CATEGORIES } from "../src/lib/catalogue";
import { REVIEW_PRODUCTS } from "../src/lib/review-stock";
import { reviewStockEnabled } from "../src/lib/review-mode";
import photos from "../src/lib/review-stock-photos.json";

test("sample inventory is available only in explicitly enabled deploy previews", () => {
  assert.equal(reviewStockEnabled("deploy-preview", "true"), true);
  for (const context of [undefined, "production", "branch-deploy", "dev"]) {
    assert.equal(reviewStockEnabled(context, "true"), false);
  }
  assert.equal(reviewStockEnabled("deploy-preview", "false"), false);
});

test("every category has enough labelled samples for pagination and mixed galleries", () => {
  assert.equal(new Set(REVIEW_PRODUCTS.map((product) => product.slug)).size, 252);
  for (const category of PRODUCT_CATEGORIES) {
    const products = REVIEW_PRODUCTS.filter((product) => product.category === category);
    assert.equal(products.length, 36);
    assert.ok(products.every((product) => product.sample && product.description.includes("Fictional sample")));
    assert.ok(products.some((product) => product.imageUrls.length > 1));
    assert.ok(products.some((product) => product.imageUrls[0]?.includes("landscape")));
    assert.ok(products.filter((product) => product.imageUrls[0]?.includes("portrait")).length > 20);
    assert.ok(products.some((product) => product.imageUrls.length === 0));
    for (const product of products) {
      assert.ok(product.imageUrls.every((url) => existsSync(`public${url}`)));
    }
  }
});

test("sample photos have credits and iPhone-style 3:4 or 4:3 dimensions", async () => {
  assert.equal(photos.length, 28);
  for (const photo of photos) {
    assert.ok(photo.source.startsWith("https://unsplash.com/photos/"));
    assert.ok(photo.photographer.length > 0);
    const portrait = await sharp(`public${photo.portrait}`).metadata();
    const landscape = await sharp(`public${photo.landscape}`).metadata();
    assert.deepEqual([portrait.width, portrait.height], [1200, 1600]);
    assert.deepEqual([landscape.width, landscape.height], [1600, 1200]);
  }
});
