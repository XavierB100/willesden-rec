import "server-only";
import { getProducts, getProductByIdentifier } from "./data";
import { REVIEW_PRODUCTS } from "./review-stock";
import { isReviewStockEnabled } from "./review-mode";

/** Preview samples never enter the database or owner management routes. */
export async function getStorefrontProducts(options?: Parameters<typeof getProducts>[0]) {
  if (!isReviewStockEnabled()) return getProducts(options);
  let products = REVIEW_PRODUCTS.filter((product) =>
    (!options?.category || product.category === options.category) &&
    (options?.includeSold !== false || product.status === "available"),
  );
  if (options?.limit) products = products.slice(0, options.limit);
  return products;
}

export async function getStorefrontProductByIdentifier(identifier: string) {
  if (!isReviewStockEnabled()) return getProductByIdentifier(identifier);
  return REVIEW_PRODUCTS.find((product) => product.slug === identifier || product.id === identifier) ?? null;
}
