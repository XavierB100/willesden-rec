import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "./catalogue";

export type StockSort = "latest" | "price-asc" | "price-desc";

export const STOCK_SORT_OPTIONS: Array<{ value: StockSort; label: string }> = [
  { value: "latest", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

export function isProductCategory(
  value?: string | string[],
): value is ProductCategory {
  return (
    typeof value === "string" &&
    PRODUCT_CATEGORIES.includes(value as ProductCategory)
  );
}

export function isStockSort(value?: string | string[]): value is StockSort {
  return STOCK_SORT_OPTIONS.some((option) => option.value === value);
}

export function sortProducts(products: Product[], sort: StockSort) {
  return [...products].sort((a, b) => {
    if (sort !== "latest") {
      if (a.price === null && b.price === null) return 0;
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return sort === "price-asc" ? a.price - b.price : b.price - a.price;
    }
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

export function stockHref(
  category: ProductCategory | undefined,
  sort: StockSort,
  search = "",
) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort !== "latest") params.set("sort", sort);
  if (search.trim()) params.set("q", search.trim());
  const query = params.toString();
  return query ? `/stock?${query}` : "/stock";
}
