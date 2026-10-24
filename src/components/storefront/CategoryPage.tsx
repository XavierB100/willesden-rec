import { getStorefrontProducts } from "@/lib/storefront-data";
import type { ProductCategory } from "@/lib/catalogue";
import { StockBrowser } from "@/components/products/StockBrowser";
import { PageIntro } from "./PageIntro";

/** Category landing routes share the same search, sorting and paging as stock. */
export async function CategoryPage({
  category,
  description,
}: {
  category: ProductCategory;
  description: string;
}) {
  const products = await getStorefrontProducts({ category, includeSold: true });
  return (
    <>
      <PageIntro eyebrow="Explore the collection" title={category}>
        <p>{description}</p>
      </PageIntro>
      <div className="site-container section-space">
        <StockBrowser
          products={products}
          category={category}
          initialQuery=""
          initialSort="latest"
        />
      </div>
    </>
  );
}
