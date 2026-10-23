import { getStorefrontProducts } from "@/lib/storefront-data";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Willesden Reclamation | Architectural Salvage in London",
  "Browse reclaimed Victorian fireplaces, antique doors, windows, garden pieces, and architectural salvage from Willesden Reclamation in London NW10.",
  "/",
);

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestProducts = await getStorefrontProducts({ includeSold: false, limit: 5 });

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-vintage-moss text-vintage-cream py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-vintage-gold via-vintage-moss to-vintage-moss" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 space-y-8 text-center md:text-left">
          <div className="md:w-2/3 space-y-6">
            <span className="inline-block text-vintage-gold tracking-widest uppercase text-xs font-sans font-semibold mb-2">
              Established 2018
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              Reclaiming London&apos;s <br />
              <span className="text-vintage-gold italic">
                Architectural Soul
              </span>
            </h1>
            <p className="text-lg md:text-xl text-vintage-cream/80 max-w-2xl font-sans leading-relaxed">
              Original Victorian fireplaces, antique doors, reclaimed windows,
              and unique salvaged items from our Willesden yard.
            </p>
            <div className="pt-4 flex flex-col md:flex-row gap-4">
              <ButtonLink href="/stock" size="lg" className="w-full md:w-auto">
                View Current Stock
              </ButtonLink>
              <ButtonLink
                href="/contact"
                size="lg"
                variant="outline"
                className="w-full md:w-auto border-vintage-gold text-vintage-gold hover:bg-vintage-gold hover:text-vintage-charcoal"
              >
                Visit the Yard
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-vintage-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="flex items-end justify-between border-b border-vintage-charcoal/10 pb-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-vintage-charcoal">
                Latest Arrivals
              </h2>
              <p className="text-vintage-charcoal/80 font-sans">
                Fresh from our Willesden yard.
              </p>
            </div>
            <Link
              href="/stock"
              className="hidden md:flex items-center text-forest-green hover:text-vintage-charcoal font-medium transition-colors"
            >
              View All Stock <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {latestProducts.length > 0 ? (
            <div className="product-grid">
              {latestProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-vintage-charcoal/80 font-serif text-xl">
              New stock is being prepared. Please contact the yard for current
              availability.
            </div>
          )}

          <div className="md:hidden flex justify-center pt-8">
            <ButtonLink href="/stock" variant="outline" className="w-full">
              View All Stock
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
