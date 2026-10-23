import { getStorefrontProducts } from "@/lib/storefront-data";
import { pageMetadata } from "@/lib/seo";
import { isProductCategory, isStockSort } from "@/lib/stock-browsing";
import type { Metadata } from "next";
import { StockBrowser } from "@/components/products/StockBrowser";

export const metadata: Metadata = pageMetadata(
  "Current Stock | Willesden Reclamation",
  "Browse current reclaimed fireplaces, doors, windows, garden pieces, furniture, lighting, and other architectural salvage from Willesden Reclamation.",
  "/stock",
);

interface StockPageProps {
  searchParams?: Promise<{ category?: string | string[]; sort?: string | string[]; q?: string | string[] }>;
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

        <StockBrowser
          key={`${selectedCategory || "all"}-${selectedSort}-${selectedQuery}`}
          products={filteredProducts}
          category={selectedCategory}
          initialQuery={selectedQuery}
          initialSort={selectedSort}
        />
      </div>
    </div>
  );
}
