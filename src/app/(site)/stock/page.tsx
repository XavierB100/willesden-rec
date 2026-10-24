import { PageIntro } from "@/components/storefront/PageIntro";
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
  searchParams?: Promise<{
    category?: string | string[];
    sort?: string | string[];
    q?: string | string[];
  }>;
}

export default async function StockPage({ searchParams }: StockPageProps) {
  const params = await searchParams;
  const selectedCategory = isProductCategory(params?.category)
    ? params?.category
    : undefined;
  const selectedSort = isStockSort(params?.sort) ? params.sort : "latest";
  const selectedQuery =
    typeof params?.q === "string" ? params.q.trim().slice(0, 200) : "";
  const filteredProducts = await getStorefrontProducts({
    category: selectedCategory,
    includeSold: true,
  });

  return (
    <>
      <PageIntro eyebrow="The collection" title="Pieces with a past.">
        <p>
          Explore the latest finds from our Willesden yard. Find something you
          love, then get in touch to make it yours.
        </p>
      </PageIntro>
      <div className="site-container section-space">
        <StockBrowser
          key={`${selectedCategory || "all"}-${selectedSort}-${selectedQuery}`}
          products={filteredProducts}
          category={selectedCategory}
          initialQuery={selectedQuery}
          initialSort={selectedSort}
        />
      </div>
    </>
  );
}
