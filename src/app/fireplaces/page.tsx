"use client";

import { products } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function FireplacesPage() {
    const filteredProducts = products.filter((product) => product.category === 'Fireplaces');

    return (
        <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center space-x-4">
                    <Link href="/stock" className="text-vintage-charcoal/60 hover:text-vintage-charcoal transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-charcoal">
                        Fireplaces
                    </h1>
                </div>
                <p className="text-vintage-charcoal/60 max-w-2xl font-sans">
                    Our curated collection of restored Victorian and Edwardian fireplaces.
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-vintage-charcoal/50 font-serif">We are currently restocking fireplaces. Check back soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
