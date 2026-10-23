import { getStorefrontProducts } from "@/lib/storefront-data";
import { pageMetadata } from "@/lib/seo";
import { searchProducts } from "@/lib/catalogue-search";
import type { Metadata } from "next";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/data";
import { ProductListing } from "@/components/products/ProductListing";
import { Button, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata(
  "Current Stock | Willesden Reclamation",
  "Browse current reclaimed fireplaces, doors, windows, garden pieces, furniture, lighting, and other architectural salvage from Willesden Reclamation.",
  "/stock",
);

interface StockPageProps {
  searchParams?: Promise<{ category?: string | string[]; sort?: string | string[]; q?: string | string[] }>;
}

type StockSort = "latest" | "price-asc" | "price-desc";

const STOCK_SORT_OPTIONS: Array<{ value: StockSort; label: string }> = [
  { value: "latest", label: "Latest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function isProductCategory(value?: string | string[]): value is ProductCategory {
  return typeof value === "string" && PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

function isStockSort(value?: string | string[]): value is StockSort {
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

function stockHref(category: ProductCategory | undefined, sort: StockSort, search = "") {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort !== "latest") params.set("sort", sort);
  if (search) params.set("q", search);
  const query = params.toString();
  return query ? `/stock?${query}` : "/stock";
}

export default async function StockPage({ searchParams }: StockPageProps) {
  const params = await searchParams;
  const selectedCategory = isProductCategory(params?.category)
    ? params?.category
    : undefined;
  const selectedSort = isStockSort(params?.sort) ? params.sort : "latest";
  const selectedQuery = typeof params?.q === "string" ? params.q.trim().slice(0, 200) : "";
  const filteredProducts = await getStorefrontProducts({
    category: selectedCategory,
    includeSold: true,
  });
  const sortedProducts = sortProducts(searchProducts(filteredProducts, selectedQuery), selectedSort);

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
              href={stockHref(undefined, selectedSort, selectedQuery)}
              variant={!selectedCategory ? "primary" : "outline"}
              className="min-h-9 px-3 py-1.5 text-xs sm:min-h-11 sm:px-6 sm:py-2 sm:text-base"
            >
              All
            </ButtonLink>
            {PRODUCT_CATEGORIES.map((category) => (
              <ButtonLink
                key={category}
                href={stockHref(category, selectedSort, selectedQuery)}
                variant={selectedCategory === category ? "primary" : "outline"}
                className="min-h-9 px-3 py-1.5 text-xs sm:min-h-11 sm:px-6 sm:py-2 sm:text-base"
              >
                {category}
              </ButtonLink>
            ))}
          </div>

          <form action="/stock" role="search" className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:grid-cols-[minmax(0,1fr)_14rem_auto]">
            {selectedCategory && (
              <input type="hidden" name="category" value={selectedCategory} />
            )}
            <label className="col-span-2 sm:col-span-1 flex min-w-0 flex-col gap-2 text-sm font-bold text-vintage-charcoal">
              Search stock
              <input
                key={selectedQuery}
                type="search"
                name="q"
                defaultValue={selectedQuery}
                maxLength={200}
                placeholder="Try a door, fireplace or material"
                className="h-11 w-full min-w-0 rounded-sm border-2 border-vintage-charcoal bg-white px-3 text-base font-medium text-vintage-charcoal focus:outline-none focus:border-forest-green"
              />
            </label>
            <label className="flex min-w-0 flex-col gap-2 text-sm font-bold text-vintage-charcoal">
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
              Search
            </Button>
          </form>
          {selectedQuery && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-vintage-charcoal/80">
                {sortedProducts.length} {sortedProducts.length === 1 ? "item" : "items"} matching &ldquo;{selectedQuery}&rdquo;
              </p>
              <ButtonLink href={stockHref(selectedCategory, selectedSort)} variant="ghost" size="sm" className="px-2 text-sm underline">
                Clear search
              </ButtonLink>
            </div>
          )}
        </div>

        {sortedProducts.length > 0 ? (
          <ProductListing key={`${selectedCategory || "all"}-${selectedSort}-${selectedQuery}`} products={sortedProducts} />
        ) : (
          <div className="text-center py-20 opacity-60 font-serif text-xl">
            {selectedQuery ? "No matching stock found. Try another search or clear it above." : "No items found in this category. Please contact us for unlisted stock."}
          </div>
        )}
      </div>
    </div>
  );
}
