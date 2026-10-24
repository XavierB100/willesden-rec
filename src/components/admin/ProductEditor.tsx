import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save, ArrowUpRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_IMAGE_PLACEHOLDER,
  formatPrice,
  type ProductCategory,
  type ProductStatus,
} from "@/lib/catalogue";
import { Field } from "./Field";
import { PhotoManager } from "./PhotoManager";
import type { AdminWorkspace } from "./useAdminWorkspace";

export function ProductEditor({ workspace: w }: { workspace: AdminWorkspace }) {
  const p = w.productForm;
  const disabled = w.isLoading || w.isUploading || !w.dataReady;
  const saved = w.products.find((item) => item.id === p.id);
  const price =
    p.price.trim() && Number.isFinite(Number(p.price)) ? Number(p.price) : null;
  return (
    <section>
      <button className="text-link mb-5" onClick={() => w.setView("inventory")}>
        <ArrowLeft size={16} /> Back to inventory
      </button>
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">A piece with a story</p>
          <h1>{p.id ? "Edit product" : "Add a product"}</h1>
          <p>
            {p.id
              ? "Keep the details as good as the piece itself."
              : "A few details. Some good photographs. A new beginning."}
          </p>
        </div>
        <span
          className={`status-badge ${w.productDirty ? "unsaved" : "available"}`}
        >
          {w.productDirty ? "Unsaved changes" : p.id ? "Saved" : "New listing"}
        </span>
      </div>
      <form onSubmit={w.handleProductSubmit} id="product-form">
        <fieldset disabled={disabled} className="editor-grid">
          <div className="editor-main">
            <section className="editor-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">01 / Tell its story</p>
                  <h2>Product details</h2>
                </div>
              </div>
              <div className="field-grid">
                <Field
                  label="Product title *"
                  wide
                  hint="A clear name helps people find it. For example, Victorian cast iron fireplace."
                >
                  <input
                    required
                    name="title"
                    maxLength={200}
                    value={p.title}
                    onChange={(e) =>
                      w.updateProductForm({ title: e.target.value })
                    }
                    placeholder="Give this piece a name"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={p.category}
                    onChange={(e) =>
                      w.updateProductForm({
                        category: e.target.value as ProductCategory,
                      })
                    }
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Price (£)"
                  hint="Leave blank for price on application (POA)."
                >
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={p.price}
                    onChange={(e) =>
                      w.updateProductForm({ price: e.target.value })
                    }
                    placeholder="e.g. 250.00"
                  />
                </Field>
                <Field
                  label="Dimensions"
                  wide
                  hint="Include units and any measurements a buyer will need."
                >
                  <input
                    value={p.dimensions}
                    onChange={(e) =>
                      w.updateProductForm({ dimensions: e.target.value })
                    }
                    placeholder="H: 102 cm × W: 76 cm × D: 15 cm"
                  />
                </Field>
                <Field
                  label="Description *"
                  wide
                  hint="Describe the material, period, condition and anything that makes it special."
                >
                  <textarea
                    required
                    rows={6}
                    maxLength={10000}
                    value={p.description}
                    onChange={(e) =>
                      w.updateProductForm({ description: e.target.value })
                    }
                    placeholder="Tell the story of this piece…"
                  />
                </Field>
              </div>
            </section>
            <PhotoManager workspace={w} />
            <section className="editor-panel">
              <details>
                <summary className="font-semibold py-2">
                  Listing address
                </summary>
                <div className="mt-4">
                  <Field
                    label="URL slug"
                    hint={
                      p.id
                        ? "Keep this unchanged to preserve existing links to the listing."
                        : "Created from the title. You can adjust it before publishing."
                    }
                  >
                    <input
                      maxLength={200}
                      value={p.slug}
                      onChange={(e) =>
                        w.updateProductForm({ slug: e.target.value })
                      }
                    />
                  </Field>
                  <p className="field-help break-all">
                    /products/{p.slug || "your-product"}
                  </p>
                </div>
              </details>
            </section>
          </div>
          <aside className="editor-sidebar">
            <section className="editor-panel">
              <p className="eyebrow">On the website</p>
              <h2 className="font-serif text-2xl mb-4">Listing preview</h2>
              <div className="listing-preview">
                <div className="relative aspect-[3/4] bg-vintage-cream">
                  <Image
                    src={p.imageUrls[0] || PRODUCT_IMAGE_PLACEHOLDER}
                    alt={p.title || "Your cover photo"}
                    fill
                    sizes="300px"
                    className="object-contain"
                  />
                </div>
                <div className="p-4">
                  <p className="eyebrow mb-2">{p.category}</p>
                  <h3 className="font-serif text-xl">
                    {p.title || "Your product title"}
                  </h3>
                  <p className="mt-3 font-serif text-lg">
                    {formatPrice(price)}
                  </p>
                </div>
              </div>
              <p className="field-help">
                Preview of your current edits. Changes appear on the website
                after saving.
              </p>
              <Field label="Availability">
                <select
                  value={p.status}
                  onChange={(e) =>
                    w.updateProductForm({
                      status: e.target.value as ProductStatus,
                    })
                  }
                >
                  <option value="available">Available to buy</option>
                  <option value="sold">Sold</option>
                </select>
              </Field>
              <p className="field-help">
                Sold pieces keep their page, with enquiries disabled.
              </p>
              {saved && (
                <Link
                  href={`/products/${saved.slug}`}
                  target="_blank"
                  className="text-link"
                >
                  View saved listing <ArrowUpRight size={16} />
                </Link>
              )}
            </section>
            {saved && (
              <section className="editor-panel">
                <h2 className="font-serif text-xl">Remove this listing</h2>
                <p className="field-help">
                  If it has found a new home, mark it sold instead. Deleting
                  permanently removes the listing.
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-800 px-0"
                  onClick={() => w.handleDeleteProduct(saved)}
                  disabled={disabled}
                >
                  <Trash2 size={16} /> Delete product
                </Button>
              </section>
            )}
          </aside>
        </fieldset>
        <div className="editor-savebar">
          <p>
            <span className={`save-dot ${w.productDirty ? "dirty" : ""}`} />
            {w.isUploading
              ? w.uploadProgress
              : w.productDirty
                ? "You have unsaved changes"
                : p.id
                  ? "All changes saved"
                  : "Ready when you are"}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={w.discardProduct}
              disabled={disabled}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={disabled}>
              <Save size={17} />
              {w.isLoading
                ? "Saving…"
                : p.id
                  ? "Save changes"
                  : "Publish product"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
