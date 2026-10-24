import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  Plus,
  Pencil,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_IMAGE_PLACEHOLDER,
  formatPrice,
} from "@/lib/catalogue";
import type { AdminWorkspace } from "./useAdminWorkspace";
import { useState } from "react";

const PAGE_SIZE = 12;
export function Inventory({ workspace: w }: { workspace: AdminWorkspace }) {
  const [page, setPage] = useState(1);
  const count = w.visibleProducts.length;
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const disabled = w.isLoading || w.isUploading || !w.dataReady;
  const counts = {
    all: w.products.length,
    available: w.products.filter((p) => p.status === "available").length,
    sold: w.products.filter((p) => p.status === "sold").length,
  };
  return (
    <section aria-labelledby="inventory-heading">
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">Your collection</p>
          <h1 id="inventory-heading">Inventory</h1>
          <p>Every piece, in its place.</p>
        </div>
        <Button onClick={() => w.selectProduct()} disabled={disabled}>
          <Plus size={18} /> Add a product
        </Button>
      </div>
      <div className="inventory-summary">
        {(["all", "available", "sold"] as const).map((status) => (
          <button
            key={status}
            onClick={() => {
              w.setStatusFilter(status);
              setPage(1);
            }}
            aria-pressed={w.statusFilter === status}
            className="summary-card"
          >
            <span>
              {status === "all"
                ? "All pieces"
                : status === "available"
                  ? "Available to buy"
                  : "Found a new home"}
            </span>
            <strong>{w.dataReady ? counts[status] : "—"}</strong>
            <span className="summary-label">
              {status === "all"
                ? "Your complete catalogue"
                : status === "available"
                  ? "Available"
                  : "Sold"}
            </span>
          </button>
        ))}
      </div>
      <div className="inventory-panel">
        <div className="inventory-toolbar">
          <label className="search-field">
            <Search size={18} />
            <span className="sr-only">Search inventory</span>
            <input
              type="search"
              placeholder="Find a piece by title or category…"
              value={w.search}
              onChange={(e) => {
                w.setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <details className="category-filter">
            <summary>
              {w.selectedCategories.length
                ? `${w.selectedCategories.length} categories`
                : "All categories"}
              <span aria-hidden="true">⌄</span>
            </summary>
            <div className="category-filter-options">
              <p className="text-xs font-semibold mb-2">Filter categories</p>
              {PRODUCT_CATEGORIES.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={w.selectedCategories.includes(category)}
                    onChange={(event) => {
                      w.setSelectedCategories(
                        event.target.checked
                          ? [...w.selectedCategories, category]
                          : w.selectedCategories.filter(
                              (item) => item !== category,
                            ),
                      );
                      setPage(1);
                    }}
                  />
                  {category}
                </label>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  w.setSelectedCategories([]);
                  setPage(1);
                }}
                className="w-full mt-2"
              >
                Clear categories
              </Button>
            </div>
          </details>
        </div>
        <div className="inventory-list-heading">
          <span>Piece / category</span>
          <span>Price</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {!w.dataReady ? (
          <div className="empty-state" role="status">
            <p>
              {w.isLoading
                ? "Loading your catalogue…"
                : "Your catalogue couldn’t be loaded."}
            </p>
            {!w.isLoading && <Button onClick={w.retry}>Try again</Button>}
          </div>
        ) : !count ? (
          <div className="empty-state">
            <Search size={28} />
            <h2 className="font-serif text-2xl">
              {w.products.length
                ? "No pieces found"
                : "Your collection starts here"}
            </h2>
            <p>
              {w.products.length
                ? "Try another search or reset your filters."
                : "Add your first piece, upload its photos and make it available to browse."}
            </p>
            {w.products.length ? (
              <Button
                variant="outline"
                onClick={() => {
                  w.setSearch("");
                  w.setSelectedCategories([]);
                  w.setStatusFilter("all");
                  setPage(1);
                }}
              >
                Reset filters
              </Button>
            ) : (
              <Button onClick={() => w.selectProduct()}>Add a product</Button>
            )}
          </div>
        ) : (
          w.visibleProducts.slice(start, start + PAGE_SIZE).map((p) => (
            <article className="inventory-row" key={p.id}>
              <button
                className="inventory-piece"
                onClick={() => w.selectProduct(p)}
                disabled={disabled}
              >
                <Image
                  src={p.imageUrls[0] || PRODUCT_IMAGE_PLACEHOLDER}
                  alt=""
                  width={64}
                  height={80}
                />
                <span>
                  <strong>{p.title}</strong>
                  <small>
                    {p.category} · {p.imageUrls.length}{" "}
                    {p.imageUrls.length === 1 ? "photo" : "photos"}
                  </small>
                </span>
              </button>
              <span className="inventory-price">{formatPrice(p.price)}</span>
              <span className={`status-badge ${p.status}`}>
                {p.status === "available" ? "Available" : "Sold"}
              </span>
              <div className="inventory-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => w.selectProduct(p)}
                  disabled={disabled}
                  aria-label={`Edit ${p.title}`}
                >
                  <Pencil size={16} />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  onClick={() => w.toggleStatus(p)}
                  aria-label={`Mark ${p.title} ${p.status === "available" ? "sold" : "available"}`}
                  title={
                    p.status === "available" ? "Mark sold" : "Make available"
                  }
                >
                  {p.status === "available" ? (
                    <Check size={17} />
                  ) : (
                    <RotateCcw size={17} />
                  )}
                </Button>
                <Link
                  href={`/products/${p.slug}`}
                  target="_blank"
                  aria-label={`View ${p.title} on website`}
                  className="icon-button"
                >
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))
        )}
        {count > 0 && (
          <div className="inventory-pagination">
            <p role="status">
              {start + 1}–{Math.min(start + PAGE_SIZE, count)} of {count} pieces
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      <p className="workspace-note">
        Mark a piece sold to keep its page and history. It will no longer accept
        purchase enquiries.
      </p>
    </section>
  );
}
