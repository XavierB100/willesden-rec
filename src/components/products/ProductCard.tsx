"use client";

import { CARD_IMAGE_SIZES, ProductPhoto } from "./ProductPhoto";
import type { MouseEvent } from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  formatPrice,
  type Product,
} from "@/lib/catalogue";
import { ButtonLink } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const images = product.imageUrls.length
    ? product.imageUrls
    : [PRODUCT_IMAGE_PLACEHOLDER];
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;
  const href = `/products/${product.slug || product.id}`;

  function showPrevious(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function showNext(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <div className="group flex min-w-0 flex-col bg-white border border-vintage-charcoal/5 hover:border-vintage-gold/50 transition-all duration-300 hover:shadow-lg rounded-sm overflow-hidden">
      <div className="relative aspect-square bg-vintage-cream overflow-hidden">
        {product.status === "sold" && (
          <div className="absolute bottom-3 right-3 z-20 bg-vintage-charcoal text-vintage-cream text-xs font-bold px-3 py-1 uppercase tracking-widest">
            Sold
          </div>
        )}
        <ProductPhoto
          images={images}
          activeIndex={activeIndex}
          title={product.title}
          sizes={CARD_IMAGE_SIZES}
          eager={priority}
        />
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Show previous product photo"
              className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full p-1.5 text-vintage-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-vintage-charcoal/10 hover:bg-white">
                <ChevronLeft className="h-4 w-4" />
              </span>
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Show next product photo"
              className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full p-1.5 text-vintage-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-vintage-charcoal/10 hover:bg-white">
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
            <div className="absolute left-3 top-3 z-20 rounded-full bg-vintage-charcoal/85 px-2.5 py-1 text-[11px] font-semibold text-vintage-cream">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col flex-grow p-2.5 md:p-3 gap-1">
        <div className="text-[10px] md:text-xs font-sans text-forest-green uppercase tracking-wide">
          {product.category}
          {product.sample && " · Sample"}
        </div>
        <h3 className="font-serif text-base md:text-lg leading-snug text-vintage-charcoal line-clamp-2">
          {product.title}
        </h3>

        <div className="mt-auto pt-1.5 flex flex-col gap-1 items-start border-t border-vintage-charcoal/5">
          <span className="font-serif text-lg md:text-xl leading-snug font-bold text-vintage-charcoal">
            {formatPrice(product.price)}
          </span>
          <ButtonLink
            href={href}
            size="sm"
            variant="outline"
            className="w-full px-2 text-xs md:text-sm"
          >
            View Details
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
