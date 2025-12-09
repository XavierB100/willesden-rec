import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/data';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group flex flex-col bg-white border border-vintage-charcoal/5 hover:border-vintage-gold/50 transition-all duration-300 hover:shadow-lg rounded-sm overflow-hidden">
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-vintage-cream/20 overflow-hidden">
                {product.status === 'sold' && (
                    <div className="absolute top-4 right-4 z-10 bg-vintage-charcoal text-vintage-cream text-xs font-bold px-3 py-1 uppercase tracking-widest">
                        Sold
                    </div>
                )}
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-4 space-y-3">
                <div className="text-xs font-sans text-forest-green uppercase tracking-wide">
                    {product.category}
                </div>
                <h3 className="font-serif text-lg leading-snug text-vintage-charcoal line-clamp-2 min-h-[3.5rem]">
                    {product.title}
                </h3>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-vintage-charcoal/5">
                    <span className="font-serif text-xl font-bold text-vintage-charcoal">
                        £{product.price}
                    </span>
                    <Link href={`/products/${product.id}`}>
                        <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
