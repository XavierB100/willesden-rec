import { getProducts } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ProductListing } from "@/components/products/ProductListing";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Reclaimed Doors | Willesden Reclamation",
  "Browse reclaimed period pine doors and stained glass from Willesden Reclamation.",
  "/doors",
);

export const dynamic = "force-dynamic";

export default async function DoorsPage() {
  const filteredProducts = await getProducts({
    category: "Doors",
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
            Doors
          </h1>
        </div>
        <p className="text-vintage-charcoal/80 max-w-2xl font-sans">
          Reclaimed period pine doors and stained glass.
        </p>

        {filteredProducts.length > 0 ? (
          <ProductListing products={filteredProducts} />
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-vintage-charcoal/80 font-serif">
              No doors currently listed. Please contact us for unlisted stock.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
