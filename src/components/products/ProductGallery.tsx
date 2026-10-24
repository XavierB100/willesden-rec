"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { ProductPhoto } from "./ProductPhoto";
import { PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/catalogue";

interface ProductGalleryProps {
  title: string;
  imageUrls: string[];
  sold?: boolean;
}

export function ProductGallery({
  title,
  imageUrls,
  sold = false,
}: ProductGalleryProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const images = imageUrls.length ? imageUrls : [PRODUCT_IMAGE_PLACEHOLDER];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!isLightboxOpen) return;
    const viewer = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    viewer?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      viewer?.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [isLightboxOpen]);

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-white rounded-sm overflow-hidden border border-vintage-charcoal/5 shadow-sm">
        {sold && (
          <div className="absolute bottom-4 left-4 z-20 bg-vintage-charcoal text-vintage-cream text-sm font-bold px-4 py-2 uppercase tracking-widest shadow-md">
            Sold Out
          </div>
        )}
        <ProductPhoto
          images={images}
          activeIndex={activeIndex}
          title={title}
          sizes="(min-width: 1344px) 608px, (min-width: 1024px) calc((100vw - 128px) / 2), (min-width: 768px) calc((100vw - 112px) / 2), calc(100vw - 32px)"
          eager
        />
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="View product photo full screen"
          className="absolute right-4 top-4 z-30 rounded-full bg-white/95 p-3 text-vintage-charcoal shadow-md ring-1 ring-vintage-charcoal/10 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Show previous product photo"
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 p-3 text-vintage-charcoal shadow-md ring-1 ring-vintage-charcoal/10 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Show next product photo"
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/95 p-3 text-vintage-charcoal shadow-md ring-1 ring-vintage-charcoal/10 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute top-4 left-4 z-20 rounded-full bg-vintage-charcoal/80 px-3 py-1 text-xs font-semibold text-vintage-cream">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show product photo ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative aspect-square overflow-hidden rounded-sm border bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold ${activeIndex === index ? "border-vintage-gold" : "border-vintage-charcoal/10"}`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1} for ${title}`}
                fill
                sizes="120px"
                className="object-contain bg-vintage-cream/40"
              />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <dialog
          ref={dialog}
          onCancel={() => setIsLightboxOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsLightboxOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              showPrevious();
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              showNext();
            }
          }}
          className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-vintage-charcoal/95 px-3 pb-20 pt-20 md:px-20"
          aria-label={`Full screen photos for ${title}`}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close full screen photo viewer"
            className="absolute right-4 top-4 z-[110] rounded-full bg-white/95 p-3 text-vintage-charcoal shadow-md hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative mx-auto h-full max-w-7xl">
            <ProductPhoto
              images={images}
              activeIndex={activeIndex}
              title={title}
              sizes="(min-width: 1440px) 1280px, (min-width: 768px) calc(100vw - 160px), calc(100vw - 24px)"
              eager
            />

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Show previous product photo"
                  className="absolute left-2 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/95 p-3 text-vintage-charcoal shadow-md hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold md:left-6"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Show next product photo"
                  className="absolute right-2 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/95 p-3 text-vintage-charcoal shadow-md hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold md:right-6"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
                <div className="absolute -bottom-14 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-vintage-charcoal shadow-md">
                  {activeIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}
