import assert from "node:assert/strict";
import test from "node:test";
import { cataloguePage } from "../src/lib/catalogue-pagination";

test("every responsive catalogue page contains at most six rows", () => {
  for (const columns of [2, 3, 4, 5]) {
    const seen: number[] = [];
    const items = Array.from({ length: 73 }, (_, index) => index);
    const first = cataloguePage(items.length, columns);
    assert.equal(first.perPage, columns * 6);
    for (let page = 0; page < first.pageCount; page++) {
      const range = cataloguePage(items.length, columns, page * first.perPage);
      const visible = items.slice(range.start, range.end);
      assert.ok(Math.ceil(visible.length / columns) <= 6);
      seen.push(...visible);
    }
    assert.deepEqual(seen, items, "next/previous ranges must not skip or duplicate products");
  }
});

test("pagination starts only after six complete rows", () => {
  for (const columns of [2, 3, 4, 5]) {
    const limit = columns * 6;
    assert.equal(cataloguePage(limit, columns).pageCount, 1);
    assert.equal(cataloguePage(limit + 1, columns).pageCount, 2);
  }
});

test("resizing retains the anchor product and clamps stale positions", () => {
  for (const columns of [2, 3, 4, 5]) {
    const range = cataloguePage(73, columns, 48);
    assert.ok(range.start <= 48 && range.end > 48);
  }
  assert.equal(cataloguePage(5, 2, 48).page, 1);
  assert.equal(cataloguePage(0, 2).end, 0);
});
