"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/catalogue";
import { searchProducts } from "@/lib/catalogue-search";
import {
  STOCK_SORT_OPTIONS,
  isStockSort,
  sortProducts,
  stockHref,
  type StockSort,
} from "@/lib/stock-browsing";
import { ProductListing } from "./ProductListing";

interface StockBrowserProps {
  products: Product[];
  category?: ProductCategory;
  initialQuery: string;
  initialSort: StockSort;
}

export function StockBrowser({
  products,
  category,
  initialQuery,
  initialSort,
}: StockBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [appliedSort, setAppliedSort] = useState(initialSort);
  const [draftSort, setDraftSort] = useState(initialSort);
  const results = useMemo(
    () => sortProducts(searchProducts(products, query), appliedSort),
    [products, query, appliedSort],
  );

  useEffect(() => {
    function restoreSearch() {
      const params = new URLSearchParams(window.location.search);
      const sort = params.get("sort") || "latest";
      setQuery((params.get("q") || "").slice(0, 200));
      setAppliedSort(isStockSort(sort) ? sort : "latest");
      setDraftSort(isStockSort(sort) ? sort : "latest");
    }
    window.addEventListener("popstate", restoreSearch);
    return () => window.removeEventListener("popstate", restoreSearch);
  }, []);

  function updateUrl(search: string, sort = appliedSort) {
    // Preserve a shareable/reloadable search without a request for every letter.
    window.history.replaceState(null, "", stockHref(category, sort, search));
  }

  function changeQuery(value: string) {
    setQuery(value);
    updateUrl(value);
  }

  return (
    <div className="space-y-10">
      <div className="space-y-5 border-b border-vintage-charcoal/10 pb-8">
        <div className="flex flex-wrap gap-1.5 md:gap-4">
          <ButtonLink
            prefetch={false}
            href={stockHref(undefined, appliedSort, query)}
            variant={!category ? "primary" : "outline"}
            className="min-h-9 px-3 py-1.5 text-xs sm:min-h-11 sm:px-6 sm:py-2 sm:text-base"
          >
            All
          </ButtonLink>
          {PRODUCT_CATEGORIES.map((item) => (
            <ButtonLink
              prefetch={false}
              key={item}
              href={stockHref(item, appliedSort, query)}
              variant={category === item ? "primary" : "outline"}
              className="min-h-9 px-3 py-1.5 text-xs sm:min-h-11 sm:px-6 sm:py-2 sm:text-base"
            >
              {item}
            </ButtonLink>
          ))}
        </div>

        <form
          action="/stock"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            setAppliedSort(draftSort);
            updateUrl(query, draftSort);
          }}
          className="grid grid-cols-[minmax(0,1fr)_5.25rem_auto] items-end gap-2 sm:gap-3 sm:grid-cols-[minmax(0,1fr)_8rem_auto]"
        >
          {category && <input type="hidden" name="category" value={category} />}
          <label className="flex min-w-0 flex-col gap-2 text-xs sm:text-sm font-bold text-vintage-charcoal">
            Search stock
            <input
              type="search"
              name="q"
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  updateUrl(query);
                }
              }}
              maxLength={200}
              placeholder="Search stock"
              className="h-11 w-full min-w-0 rounded-sm border-2 border-vintage-charcoal bg-white px-2 sm:px-3 text-base font-medium text-vintage-charcoal focus:outline-none focus:border-forest-green"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-xs sm:text-sm font-bold text-vintage-charcoal">
            Sort by
            <select
              name="sort"
              value={draftSort}
              onChange={(event) => {
                if (isStockSort(event.target.value))
                  setDraftSort(event.target.value);
              }}
              className="h-11 w-full min-w-0 rounded-sm border-2 border-vintage-charcoal bg-white px-1 sm:px-2 text-base font-medium text-vintage-charcoal focus:outline-none focus:border-forest-green"
            >
              {STOCK_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Button
            type="submit"
            variant="outline"
            className="h-11 shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
            aria-label="Apply sort order"
          >
            Apply
          </Button>
        </form>

        {query.trim() && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p aria-live="polite" className="text-sm text-vintage-charcoal/80">
              {results.length} {results.length === 1 ? "item" : "items"}{" "}
              matching &ldquo;{query.trim()}&rdquo;
            </p>
            <ButtonLink
              prefetch={false}
              href={stockHref(category, appliedSort)}
              onClick={(event) => {
                event.preventDefault();
                changeQuery("");
              }}
              variant="ghost"
              size="sm"
              className="px-2 text-sm underline"
            >
              Clear search
            </ButtonLink>
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <ProductListing
          key={`${category || "all"}-${appliedSort}-${query}`}
          products={results}
        />
      ) : (
        <div className="text-center py-20 opacity-60 font-serif text-xl">
          {query.trim()
            ? "No matching stock found. Try another search or clear it above."
            : "No items found in this category. Please contact us for unlisted stock."}
        </div>
      )}
    </div>
  );
}
