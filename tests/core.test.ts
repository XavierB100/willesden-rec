import test from "node:test";
import assert from "node:assert/strict";
import { parseProductInput } from "../src/lib/validation";
import { formatPrice, buildWhatsAppUrl } from "../src/lib/catalogue";
import { jsonLd, pageMetadata, SITE_URL, IS_INDEXABLE } from "../src/lib/seo";

const product = {
  title: "Test fireplace",
  description: "Original",
  price: 12.34,
  category: "Fireplaces",
  imageUrls: [],
  status: "available",
};
test("inventory preserves decimal prices and POA", () => {
  assert.equal(parseProductInput(product).price, 12.34);
  assert.equal(parseProductInput({ ...product, price: null }).price, null);
  assert.equal(formatPrice(12.34), "£12.34");
  assert.equal(formatPrice(null), "POA");
});
test("invalid prices cannot enter the catalogue", () => {
  for (const price of [-1, 1.001, Infinity, "12.34", 100000000])
    assert.throws(() => parseProductInput({ ...product, price }));
});
test("malformed or ambiguous product input is rejected", () => {
  for (const input of [
    null,
    [],
    {},
    { ...product, title: 1 },
    { ...product, slug: "123" },
    { ...product, category: "Unknown" },
    { ...product, status: "draft" },
  ])
    assert.throws(() => parseProductInput(input));
});
test("photos must belong to the project's public inventory bucket", () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  const url =
    "https://example.supabase.co/storage/v1/object/public/product-images/photo.webp";
  assert.deepEqual(
    parseProductInput({ ...product, imageUrls: [url, url] }).imageUrls,
    [url],
  );
  for (const imageUrls of [
    ["javascript:alert(1)"],
    ["https://another.supabase.co/photo.jpg"],
    [23],
    [url + "/../secret"],
    Array(21).fill(url),
  ])
    assert.throws(() => parseProductInput({ ...product, imageUrls }));
});
test("structured data cannot escape its script element", () => {
  assert.equal(
    jsonLd({ name: "</script><script>alert(1)</script>" }).includes("<"),
    false,
  );
});
test("metadata uses the intended www domain and a single absolute title", () => {
  const metadata = pageMetadata(
    "Current Stock | Willesden Reclamation",
    "Description",
    "/stock",
  );
  assert.equal(metadata.alternates?.canonical, `${SITE_URL}/stock`);
  assert.deepEqual(metadata.title, {
    absolute: "Current Stock | Willesden Reclamation",
  });
  assert.equal(IS_INDEXABLE, false);
});
test("WhatsApp links encode the message and normalize the number", () => {
  assert.equal(
    buildWhatsAppUrl("+44 7907 020909", "A & B?"),
    "https://wa.me/447907020909?text=A%20%26%20B%3F",
  );
});
