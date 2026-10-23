import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Reclaimed Fireplaces | Willesden Reclamation",
  "Browse restored Victorian and Edwardian fireplaces from Willesden Reclamation in London.",
  "/fireplaces",
);

export const dynamic = "force-dynamic";

export default async function FireplacesPage() {
  const filteredProducts = await getProducts({
    category: "Fireplaces",
    includeSold: true,
  });

  return (
    <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/stock"
            className="text-vintage-charcoal/80 hover:text-vintage-charcoal transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="sr-only">Back to current stock</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-charcoal">
            Fireplaces
          </h1>
        </div>
        <p className="text-vintage-charcoal/80 max-w-2xl font-sans">
          Our curated collection of restored Victorian and Edwardian fireplaces.
        </p>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-vintage-charcoal/80 font-serif">
              We are currently restocking fireplaces. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
