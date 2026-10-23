import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import {
  getProducts,
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { Button, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata(
  "Current Stock | Willesden Reclamation",
  "Browse current reclaimed fireplaces, doors, windows, garden pieces, furniture, lighting, and other architectural salvage from Willesden Reclamation.",
  "/stock",
);

interface StockPageProps {
  searchParams?: Promise<{ category?: string; sort?: string }>;
}

type StockSort = "latest" | "price-asc" | "price-desc";

const STOCK_SORT_OPTIONS: Array<{ value: StockSort; label: string }> = [
  { value: "latest", label: "Latest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function isProductCategory(value?: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

function isStockSort(value?: string): value is StockSort {
  return STOCK_SORT_OPTIONS.some((option) => option.value === value);
}

function comparePrice(a: Product, b: Product, direction: "asc" | "desc") {
  if (a.price === null && b.price === null) return 0;
  if (a.price === null) return 1;
  if (b.price === null) return -1;
  return direction === "asc" ? a.price - b.price : b.price - a.price;
}

function sortProducts(products: Product[], sort: StockSort) {
  return [...products].sort((a, b) => {
    if (sort === "price-asc") return comparePrice(a, b, "asc");
    if (sort === "price-desc") return comparePrice(a, b, "desc");

    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

function stockHref(category: ProductCategory | undefined, sort: StockSort) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort !== "latest") params.set("sort", sort);
  const query = params.toString();
  return query ? `/stock?${query}` : "/stock";
}

export default async function StockPage({ searchParams }: StockPageProps) {
  const params = await searchParams;
  const selectedCategory = isProductCategory(params?.category)
    ? params?.category
    : undefined;
  const selectedSort = isStockSort(params?.sort) ? params.sort : "latest";
  const filteredProducts = await getProducts({
    category: selectedCategory,
    includeSold: true,
  });
  const sortedProducts = sortProducts(filteredProducts, selectedSort);

  return (
    <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-charcoal">
            Current Inventory
          </h1>
          <p className="text-vintage-charcoal/80 max-w-2xl font-sans">
            Browse our latest collection of reclaimed architectural antiques
            using the filters below.
          </p>
        </div>

        <div className="space-y-5 border-b border-vintage-charcoal/10 pb-8">
          <div className="flex flex-wrap gap-1.5 md:gap-4">
            <ButtonLink
              href={stockHref(undefined, selectedSort)}
              variant={!selectedCategory ? "primary" : "outline"}
              className="min-h-9 px-3 py-1.5 text-xs sm:min-h-11 sm:px-6 sm:py-2 sm:text-base"
            >
              All
            </ButtonLink>
            {PRODUCT_CATEGORIES.map((category) => (
              <ButtonLink
                key={category}
                href={stockHref(category, selectedSort)}
                variant={selectedCategory === category ? "primary" : "outline"}
                className="min-h-9 px-3 py-1.5 text-xs sm:min-h-11 sm:px-6 sm:py-2 sm:text-base"
              >
                {category}
              </ButtonLink>
            ))}
          </div>

          <form action="/stock" className="flex items-end gap-2">
            {selectedCategory && (
              <input type="hidden" name="category" value={selectedCategory} />
            )}
            <label className="flex min-w-0 flex-1 sm:flex-none sm:w-56 flex-col gap-2 text-sm font-bold text-vintage-charcoal">
              Sort by
              <select
                name="sort"
                defaultValue={selectedSort}
                className="h-11 w-full min-w-0 rounded-sm border-2 border-vintage-charcoal bg-white px-3 text-base font-medium text-vintage-charcoal focus:outline-none focus:border-forest-green"
              >
                {STOCK_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="submit"
              variant="outline"
              className="h-11 shrink-0 px-4 text-sm"
            >
              Apply
            </Button>
          </form>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-60 font-serif text-xl">
            No items found in this category. Please contact us for unlisted
            stock.
          </div>
        )}
      </div>
    </div>
  );
}
