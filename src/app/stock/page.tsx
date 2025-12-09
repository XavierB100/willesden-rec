"use client";

import { useState } from "react";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";

const categories = ["All", "Fireplaces", "Doors", "Garden", "Furniture", "Lighting"];

export default function StockPage() {
    const [filter, setFilter] = useState("All");

    const filteredProducts = products.filter((product) => {
        if (filter === "All") return true;
        return product.category === filter;
    });

    return (
        <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="space-y-4 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-charcoal">
                        Current Inventory
                    </h1>
                    <p className="text-vintage-charcoal/60 max-w-2xl font-sans">
                        Browse our latest collection of reclaimed architectural antiques using the filters below.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 md:gap-4 border-b border-vintage-charcoal/10 pb-8">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={filter === category ? "primary" : "outline"}
                            onClick={() => setFilter(category)}
                            className="min-w-[4rem]"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 opacity-50 font-serif text-xl">
                        No items found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
