import Link from 'next/link';
import Image from 'next/image';
import { PRODUCT_IMAGE_PLACEHOLDER, formatPrice, type Product } from '@/lib/data';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const imageSrc =
        product.imageUrls[0] ||
        PRODUCT_IMAGE_PLACEHOLDER;
    const href = `/products/${product.slug || product.id}`;

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
                    src={imageSrc}
                    alt={`Photo of ${product.title}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
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
                        {formatPrice(product.price)}
                    </span>
                    <Link href={href}>
                        <Button size="sm" variant="outline" className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
