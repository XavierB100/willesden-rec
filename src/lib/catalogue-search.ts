import type { Product } from "./catalogue";

export function searchProducts(products: Product[], query: string): Product[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return products;
  return products.filter((product) => {
    const searchable = [
      product.title,
      product.category,
      product.description,
      product.dimensions || "",
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
}
