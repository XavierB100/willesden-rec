import assert from "node:assert/strict";
import test from "node:test";
import { searchProducts } from "../src/lib/catalogue-search";
import type { Product } from "../src/lib/catalogue";
import { sortProducts, stockHref } from "../src/lib/stock-browsing";

const products: Product[] = [
  { id: "1", slug: "cast-iron", title: "Victorian fireplace", category: "Fireplaces", description: "Cast iron surround", dimensions: "90cm wide", imageUrls: [], price: 400, status: "available" },
  { id: "2", slug: "pine-door", title: "Pine panelled door", category: "Doors", description: "Original brass handle", imageUrls: [], price: null, status: "sold" },
];

test("stock search matches title, category, description and optional dimensions", () => {
  for (const query of ["victorian", "fireplaces", "iron", "90cm"]) {
    assert.deepEqual(searchProducts(products, query).map((product) => product.id), ["1"]);
  }
  assert.deepEqual(searchProducts(products, "brass").map((product) => product.id), ["2"]);
});

test("stock search combines words without depending on their order or case", () => {
  assert.deepEqual(searchProducts(products, "  IRON   Victorian ").map((product) => product.id), ["1"]);
  assert.deepEqual(searchProducts(products, "pine iron"), []);
});

test("empty searches preserve stock and searching does not mutate inventory", () => {
  const original = JSON.stringify(products);
  assert.equal(searchProducts(products, "   "), products);
  assert.deepEqual(searchProducts(products, "nothing like this"), []);
  assert.equal(JSON.stringify(products), original);
});

test("search sorting keeps POA last in both price directions", () => {
  const stock = [...products, { ...products[0], id: "3", price: 900 }];
  assert.deepEqual(sortProducts(stock, "price-asc").map((product) => product.id), ["1", "3", "2"]);
  assert.deepEqual(sortProducts(stock, "price-desc").map((product) => product.id), ["3", "1", "2"]);
  assert.deepEqual(stock.map((product) => product.id), ["1", "2", "3"]);
});

test("search links preserve category and the applied sort and can clear only the query", () => {
  const searchUrl = new URL(stockHref("Doors", "price-desc", "  oak & iron  "), "https://example.test");
  assert.equal(searchUrl.searchParams.get("q"), "oak & iron");
  assert.equal(searchUrl.searchParams.get("sort"), "price-desc");
  assert.equal(searchUrl.searchParams.get("category"), "Doors");
  assert.equal(stockHref("Doors", "price-desc", ""), "/stock?category=Doors&sort=price-desc");
});
