"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

// Matches the shared grid, including its gutters and maximum content width.
export const CARD_IMAGE_SIZES =
  "(min-width: 1344px) 237px, (min-width: 1280px) calc((100vw - 160px) / 5), (min-width: 1024px) calc((100vw - 136px) / 4), (min-width: 768px) calc((100vw - 112px) / 3), calc((100vw - 44px) / 2)";

interface ProductPhotoProps {
  images: string[];
  activeIndex: number;
  title: string;
  sizes: string;
  eager?: boolean;
  onAspectRatioChange?: (ratio: number) => void;
}

/** Keep the current photo visible until its replacement has loaded and decoded. */
export function ProductPhoto({
  images,
  activeIndex,
  title,
  sizes,
  eager = false,
  onAspectRatioChange,
}: ProductPhotoProps) {
  const frame = useRef<HTMLDivElement>(null);
  const activeImage = images[activeIndex] || images[0];
  const [displayedImage, setDisplayedImage] = useState(activeImage);
  const [loadedImage, setLoadedImage] = useState<string>();
  const [failedImage, setFailedImage] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(false);
  const loading = loadedImage !== activeImage;

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || loading || images.length < 2) return;
    // Use the same srcset and sizes as the visible image so this warms the
    // actual browser-selected variant, rather than downloading large originals.
    const neighbours = new Set([
      images[(activeIndex + 1) % images.length],
      images[(activeIndex + images.length - 1) % images.length],
    ]);
    const preloads = Array.from(neighbours, (src) => {
      const { props } = getImageProps({ src, alt: "", fill: true, sizes });
      const photo = new window.Image();
      photo.decoding = "async";
      photo.fetchPriority = "low";
      photo.sizes = props.sizes || sizes;
      photo.srcset = props.srcSet || "";
      photo.src = props.src;
      void photo.decode().catch(() => { /* The visible image offers retry. */ });
      return photo;
    });
    return () => {
      for (const photo of preloads) {
        photo.removeAttribute("srcset");
        photo.removeAttribute("src");
      }
    };
  }, [activeIndex, images, loading, sizes, visible]);

  return (
    <div ref={frame} className="absolute inset-0" aria-busy={loading && failedImage !== activeImage}>
      {Array.from(new Set([displayedImage, activeImage])).map((src) => (
        <Image
          key={`${src}-${attempt}`}
          src={src}
          alt={src === displayedImage ? `Photo ${images.indexOf(src) + 1} of ${title}` : ""}
          aria-hidden={src !== displayedImage}
          fill
          sizes={sizes}
          loading={eager || src !== displayedImage || attempt > 0 ? "eager" : "lazy"}
          fetchPriority={eager && activeIndex === 0 ? "high" : "auto"}
          className={`object-contain ${src === displayedImage && failedImage !== src ? "opacity-100" : "opacity-0"}`}
          onLoad={(event) => {
            if (src !== activeImage) return;
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (naturalWidth > 0 && naturalHeight > 0) {
              onAspectRatioChange?.(naturalWidth / naturalHeight);
            }
            setLoadedImage(src);
            setDisplayedImage(src);
            setFailedImage(undefined);
          }}
          onError={() => setFailedImage(src)}
        />
      ))}
      {failedImage === activeImage ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-vintage-cream/95 px-3 text-center text-xs text-vintage-charcoal">
          <span role="status">Photo unavailable</span>
          <button
            type="button"
            className="min-h-11 px-3 underline"
            onClick={() => {
              setFailedImage(undefined);
              setAttempt((value) => value + 1);
            }}
          >
            Retry photo
          </button>
        </div>
      ) : loading ? (
        <span role="status" className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-2 py-1 text-[11px] text-vintage-charcoal shadow-sm">
          Loading photo…
        </span>
      ) : null}
    </div>
  );
}
