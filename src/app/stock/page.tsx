import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
    title: "Current Stock | Willesden Reclamation",
    description:
        "Browse current reclaimed fireplaces, doors, garden pieces, furniture, lighting, and architectural salvage from Willesden Reclamation.",
};

interface StockPageProps {
    searchParams?: Promise<{ category?: string }>;
}

function isProductCategory(value?: string): value is ProductCategory {
    return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

export default async function StockPage({ searchParams }: StockPageProps) {
    const params = await searchParams;
    const selectedCategory = isProductCategory(params?.category)
        ? params?.category
        : undefined;
    const filteredProducts = await getProducts({
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
                    <p className="text-vintage-charcoal/60 max-w-2xl font-sans">
                        Browse our latest collection of reclaimed architectural antiques using the filters below.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-4 border-b border-vintage-charcoal/10 pb-8">
                    <Link href="/stock">
                        <Button
                            variant={!selectedCategory ? "primary" : "outline"}
                            className="min-w-[4rem]"
                        >
                            All
                        </Button>
                    </Link>
                    {PRODUCT_CATEGORIES.map((category) => (
                        <Link key={category} href={`/stock?category=${encodeURIComponent(category)}`}>
                            <Button
                                variant={selectedCategory === category ? "primary" : "outline"}
                                className="min-w-[4rem]"
                            >
                                {category}
                            </Button>
                        </Link>
                    ))}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-60 font-serif text-xl">
                        No items found in this category. Please contact us for unlisted stock.
                    </div>
                )}
            </div>
        </div>
    );
}
