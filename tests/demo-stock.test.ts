import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { PRODUCT_CATEGORIES } from "../src/lib/catalogue";
import { parseProductInput } from "../src/lib/validation";
import demos from "../src/lib/demo-stock.json";

test("the retained demo set has two unique photo sets per category with mixed orientations", () => {
  assert.equal(demos.length, 14);
  assert.equal(new Set(demos.map((demo) => demo.key)).size, 14);
  for (const category of PRODUCT_CATEGORIES) {
    assert.equal(demos.filter((demo) => demo.category === category).length, 2);
  }
  assert.equal(demos.filter((demo) => demo.cover === "portrait").length, 10);
  assert.equal(demos.filter((demo) => demo.cover === "landscape").length, 4);
});

test("retained demo photos have source records and full-resolution phone proportions", async () => {
  for (const demo of demos) {
    assert.ok(demo.source.startsWith("https://unsplash.com/photos/"));
    assert.ok(demo.photographer.length > 0);
    assert.ok(demo.description.includes("Demonstration listing"));
    assert.ok(existsSync(`public${demo.portrait}`));
    assert.ok(existsSync(`public${demo.landscape}`));
    const portrait = await sharp(`public${demo.portrait}`).metadata();
    const landscape = await sharp(`public${demo.landscape}`).metadata();
    assert.deepEqual([portrait.width, portrait.height], [1200, 1600]);
    assert.deepEqual([landscape.width, landscape.height], [1600, 1200]);
  }
});

test("demo status is explicit, validated and retained independently of ordinary edits", () => {
  const product = {
    title: "Owner edited the title",
    category: "Doors",
    price: 95,
    demo: true,
  };
  assert.equal(parseProductInput(product).demo, true);
  assert.equal(
    parseProductInput({ ...product, title: "Changed again", status: "sold" })
      .demo,
    true,
  );
  assert.equal(parseProductInput({ ...product, demo: false }).demo, false);
  assert.equal(
    parseProductInput({ title: "Ordinary stock", category: "Doors" }).demo,
    false,
  );
  for (const demo of ["true", "false", 1, {}, []]) {
    assert.throws(() => parseProductInput({ ...product, demo }));
  }
});
