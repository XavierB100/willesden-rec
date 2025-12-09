import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-vintage-moss text-vintage-cream py-24 md:py-32 overflow-hidden">
        {/* Abstract Background Pattern - can be replaced with an image later */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-vintage-gold via-vintage-moss to-vintage-moss" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 space-y-8 text-center md:text-left">
          <div className="md:w-2/3 space-y-6">
            <span className="inline-block text-vintage-gold tracking-widest uppercase text-xs font-sans font-semibold mb-2">
              Established 2018
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              Reclaiming London's <br />
              <span className="text-vintage-gold italic">Architectural Soul</span>
            </h1>
            <p className="text-lg md:text-xl text-vintage-cream/80 max-w-2xl font-sans leading-relaxed">
              We specialise in original Victorian fireplaces, antique doors, and unique salvaged items.
              Restoring the character of the past for the homes of today.
            </p>
            <div className="pt-4 flex flex-col md:flex-row gap-4">
              <Link href="/stock">
                <Button size="lg" className="w-full md:w-auto">
                  View Current Stock
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full md:w-auto border-vintage-gold text-vintage-gold hover:bg-vintage-gold hover:text-vintage-charcoal">
                  Visit the Yard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-vintage-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="flex items-end justify-between border-b border-vintage-charcoal/10 pb-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-vintage-charcoal">
                Latest Arrivals
              </h2>
              <p className="text-vintage-charcoal/60 font-sans">
                Fresh from our Willesden yard.
              </p>
            </div>
            <Link href="/stock" className="hidden md:flex items-center text-forest-green hover:text-vintage-charcoal font-medium transition-colors">
              View All Stock <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="md:hidden flex justify-center pt-8">
            <Link href="/stock">
              <Button variant="outline" className="w-full">
                View All Stock
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories / Info Section could go here */}
    </div>
  );
}
