"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/catalogue";
import {
  CATALOGUE_BREAKPOINTS,
  cataloguePage,
} from "@/lib/catalogue-pagination";
import { ProductCard } from "./ProductCard";

function subscribeToColumns(onChange: () => void) {
  const queries = CATALOGUE_BREAKPOINTS.map(({ query }) =>
    window.matchMedia(query),
  );
  for (const query of queries) query.addEventListener("change", onChange);
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange);
  };
}

function getColumns() {
  return (
    CATALOGUE_BREAKPOINTS.find(({ query }) => window.matchMedia(query).matches)
      ?.columns ?? 2
  );
}

function getServerColumns() {
  return 2;
}

export function ProductListing({ products }: { products: Product[] }) {
  const columns = useSyncExternalStore(
    subscribeToColumns,
    getColumns,
    getServerColumns,
  );
  // Retain a product position across resizes so narrowing the window cannot
  // strand the visitor beyond the final page or lose their place entirely.
  const [anchor, setAnchor] = useState(0);
  const results = useRef<HTMLElement>(null);
  const { page, pageCount, perPage, start, end } = cataloguePage(
    products.length,
    columns,
    anchor,
  );

  function goToPage(nextPage: number) {
    setAnchor((nextPage - 1) * perPage);
    results.current?.focus({ preventScroll: true });
    results.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  return (
    <section
      ref={results}
      aria-label="Product results"
      tabIndex={-1}
      className="scroll-mt-24 space-y-6"
    >
      <div className="product-grid">
        {products.slice(start, end).map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index === 0}
          />
        ))}
      </div>
      {pageCount > 1 && (
        <nav
          aria-label="Stock pages"
          className="flex flex-wrap items-center justify-center gap-3 border-t border-vintage-charcoal/10 pt-5"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </Button>
          <p role="status" className="text-center text-sm">
            Page {page} of {pageCount}
            <span className="block text-xs text-vintage-charcoal/70">
              Items {start + 1}–{end} of {products.length}
            </span>
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pageCount}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>
        </nav>
      )}
    </section>
  );
}
