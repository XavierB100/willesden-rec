"use client";

import { adminRequest } from "@/lib/admin-request";
import { prepareImage } from "@/lib/prepare-image";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  DEFAULT_SITE_SETTINGS,
  PRODUCT_IMAGE_PLACEHOLDER,
  PRODUCT_CATEGORIES,
  slugify,
  type Product,
  type ProductCategory,
  type ProductStatus,
  type SiteSettings,
} from "@/lib/catalogue";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Edit, LogOut, Plus, Save, Trash2, Upload } from "lucide-react";

interface ProductFormState {
  id?: string;
  title: string;
  slug: string;
  price: string;
  category: ProductCategory;
  description: string;
  dimensions: string;
  status: ProductStatus;
  imageUrls: string[];
}

const emptyProductForm: ProductFormState = {
  title: "",
  slug: "",
  price: "",
  category: "Fireplaces",
  description: "",
  dimensions: "",
  status: "available",
  imageUrls: [],
};

function productToForm(product: Product): ProductFormState {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price === null ? "" : String(product.price),
    category: product.category,
    description: product.description,
    dimensions: product.dimensions || "",
    status: product.status,
    imageUrls: product.imageUrls,
  };
}

export default function AdminPage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] =
    useState<ProductFormState>(emptyProductForm);
  const [productBaseline, setProductBaseline] = useState(
    JSON.stringify(emptyProductForm),
  );
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [settingsText, setSettingsText] = useState({
    addressLines: "",
    openingHours: "",
  });
  const [settingsBaseline, setSettingsBaseline] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const productDirty = JSON.stringify(productForm) !== productBaseline;
  const settingsDirty =
    dataReady &&
    JSON.stringify({ settings, settingsText }) !== settingsBaseline;
  const userId = session?.user.id;
  const visibleProducts = products.filter((product) =>
    `${product.title} ${product.category} ${product.status}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function displaySettings(value: SiteSettings) {
    const text = {
      addressLines: value.addressLines.join("\n"),
      openingHours: value.openingHours
        .map((row) => `${row.label}: ${row.value}`)
        .join("\n"),
    };
    setSettings(value);
    setSettingsText(text);
    setSettingsBaseline(
      JSON.stringify({ settings: value, settingsText: text }),
    );
  }

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        setSession(data.session);
        setAuthReady(true);
        if (error) setError(error.message);
      })
      .catch(() => {
        if (active) {
          setError("Could not load your session. Please try again.");
          setAuthReady(true);
        }
      });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!userId || !supabase) return;
    let active = true;
    void (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setIsLoading(true);
        setError("");
        setDataReady(false);
        if (!data.session) throw new Error("Missing admin session.");
        const [inventory, details] = await Promise.all([
          adminRequest<{ products: Product[] }>(
            "/api/admin/products",
            data.session.access_token,
          ),
          adminRequest<{ settings: SiteSettings }>(
            "/api/admin/settings",
            data.session.access_token,
          ),
        ]);
        if (active) {
          setProducts(inventory.products);
          displaySettings(details.settings);
          setDataReady(true);
        }
      } catch (error) {
        if (active)
          setError(
            error instanceof Error
              ? error.message
              : "Could not load admin data.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId, supabase]);

  useEffect(() => {
    if (!productDirty && !settingsDirty && !isUploading) return;
    const guard = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const guardNavigation = (event: MouseEvent) => {
      const link = (event.target as Element).closest(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !link ||
        link.target === "_blank" ||
        link.origin !== location.origin ||
        link.pathname === location.pathname
      )
        return;
      if (!confirm("Discard unsaved changes?")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    window.addEventListener("beforeunload", guard);
    document.addEventListener("click", guardNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", guard);
      document.removeEventListener("click", guardNavigation, true);
    };
  }, [productDirty, settingsDirty, isUploading]);

  useEffect(() => {
    if (message || error) feedbackRef.current?.focus();
  }, [message, error]);

  async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const { data } = await supabase!.auth.getSession();
    if (!data.session)
      throw new Error("Your session has expired. Please sign in again.");
    return adminRequest<T>(url, data.session.access_token, options);
  }

  async function runAction(action: () => Promise<void>) {
    if (busy.current) return;
    busy.current = true;
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not complete the request. Please try again.",
      );
    } finally {
      busy.current = false;
      setIsLoading(false);
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    await runAction(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setPassword("");
    });
  }

  async function handleLogout() {
    if ((productDirty || settingsDirty) && !confirm("Discard unsaved changes?"))
      return;
    await runAction(async () => {
      const result = await supabase?.auth.signOut();
      if (result?.error) throw result.error;
      setSession(null);
      setProducts([]);
      resetProduct();
      setPassword("");
      setDataReady(false);
    });
  }

  function resetProduct(form = emptyProductForm) {
    setProductForm(form);
    setProductBaseline(JSON.stringify(form));
  }
  function selectProduct(product?: Product) {
    if (
      isLoading ||
      isUploading ||
      (productDirty && !confirm("Discard unsaved product changes?"))
    )
      return;
    resetProduct(product ? productToForm(product) : emptyProductForm);
    editorRef.current?.scrollIntoView({ block: "start" });
    editorRef.current
      ?.querySelector<HTMLInputElement>('input[name="title"]')
      ?.focus({ preventScroll: true });
  }
  function updateProductForm(update: Partial<ProductFormState>) {
    setProductForm((current) => {
      const next = { ...current, ...update };
      if (
        update.title !== undefined &&
        !current.id &&
        (!current.slug || current.slug === slugify(current.title))
      )
        next.slug = slugify(update.title);
      return next;
    });
  }

  async function handleProductSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!dataReady || isUploading) return;
    await runAction(async () => {
      const parsedPrice = productForm.price.trim()
        ? Number(productForm.price)
        : null;
      if (
        parsedPrice !== null &&
        (!Number.isFinite(parsedPrice) || parsedPrice < 0)
      )
        throw new Error("Enter a valid price, or leave it blank for POA.");
      const { product } = await request<{ product: Product }>(
        productForm.id
          ? `/api/admin/products/${productForm.id}`
          : "/api/admin/products",
        {
          method: productForm.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...productForm,
            price: parsedPrice,
            dimensions: productForm.dimensions || null,
          }),
        },
      );
      setProducts((current) =>
        productForm.id
          ? current.map((item) => (item.id === product.id ? product : item))
          : [product, ...current],
      );
      setMessage(productForm.id ? "Product updated." : "Product added.");
      resetProduct();
    });
  }

  async function handleDeleteProduct(product: Product) {
    if (isUploading || !confirm(`Delete "${product.title}"?`)) return;
    await runAction(async () => {
      await request(`/api/admin/products/${product.id}`, { method: "DELETE" });
      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
      if (productForm.id === product.id) resetProduct();
      setMessage("Product deleted.");
    });
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length || busy.current || !dataReady) return;
    if (files.length + productForm.imageUrls.length > 20) {
      setError("Use up to 20 product photos.");
      return;
    }
    busy.current = true;
    setIsUploading(true);
    setError("");
    setMessage("");
    try {
      for (const original of Array.from(files)) {
        const file = await prepareImage(original);
        const formData = new FormData();
        formData.append("file", file);
        const json = await request<{ url: string }>("/api/admin/uploads", {
          method: "POST",
          body: formData,
        });
        if (typeof json.url !== "string" || !json.url)
          throw new Error(
            "Upload completed but did not return a valid image URL.",
          );
        // Keep each successful upload even if a subsequent photo fails.
        setProductForm((current) => ({
          ...current,
          imageUrls: [...current.imageUrls, json.url],
        }));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      busy.current = false;
      setIsUploading(false);
    }
  }

  async function handleSettingsSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!dataReady || isUploading) return;
    await runAction(async () => {
      const openingHours = settingsText.openingHours
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [label, ...rest] = line.split(":");
          const value = rest.join(":").trim();
          if (!label.trim() || !value)
            throw new Error(
              "Use a label and hours separated by a colon on each line.",
            );
          return { label: label.trim(), value };
        });
      const payload = {
        ...settings,
        addressLines: settingsText.addressLines
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        openingHours,
      };
      const json = await request<{ settings: SiteSettings }>(
        "/api/admin/settings",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      displaySettings(json.settings);
      setMessage("Site settings saved.");
    });
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-4">
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal">
            Admin Setup Required
          </h1>
          <p className="text-vintage-charcoal/70">
            Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
            `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_EMAIL` before using the
            admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!authReady)
    return (
      <div className="p-12 text-center" role="status">
        Stock Management…
      </div>
    );

  if (!session) {
    return (
      <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
        <form
          onSubmit={handleLogin}
          className="max-w-md mx-auto bg-white p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-6"
        >
          <div className="space-y-2 border-b border-vintage-charcoal/10 pb-4">
            <h1 className="text-3xl font-serif font-bold text-vintage-charcoal">
              Stock Management
            </h1>
            <p className="text-sm text-vintage-charcoal/80">
              Sign in with the owner account to manage stock and site details.
            </p>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <label className="block space-y-2">
            <span className="text-sm font-bold text-vintage-charcoal">
              Email
            </span>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-vintage-charcoal">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
            />
          </label>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-vintage-charcoal">
              Admin Dashboard
            </h1>
            <p className="text-vintage-charcoal/80">
              Manage inventory, photos, and public contact details.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            disabled={isLoading || isUploading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>

        {(message || error) && (
          <div
            ref={feedbackRef}
            tabIndex={-1}
            role={error ? "alert" : "status"}
            className={`border p-4 rounded-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-forest-green/20 bg-white text-forest-green"}`}
          >
            {error || message}
          </div>
        )}

        <nav aria-label="Admin sections" className="flex flex-wrap gap-3">
          <a className="underline py-3" href="#current-products">
            Current Products
          </a>
          <a className="underline py-3" href="#product-editor">
            {productForm.id ? "Edit Product" : "Add Product"}
          </a>
          <a className="underline py-3" href="#site-details">
            Site Details
          </a>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8">
          <section
            id="product-editor"
            ref={editorRef}
            className="min-w-0 bg-white p-4 sm:p-6 md:p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-vintage-charcoal/10 pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">
                  {productForm.id ? "Edit Product" : "Add Product"}
                </h2>
                <p className="text-sm text-vintage-charcoal/80">
                  Products saved here appear on the public stock pages.
                </p>
              </div>
              {productForm.id && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => selectProduct()}
                  disabled={isLoading || isUploading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              )}
            </div>

            <form onSubmit={handleProductSubmit}>
              <fieldset
                disabled={isLoading || isUploading || !dataReady}
                className="space-y-5 min-w-0"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-vintage-charcoal">
                      Title
                    </span>
                    <input
                      required
                      name="title"
                      maxLength={200}
                      value={productForm.title}
                      onChange={(event) =>
                        updateProductForm({ title: event.target.value })
                      }
                      className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-vintage-charcoal">
                      Slug
                    </span>
                    <input
                      required
                      value={productForm.slug}
                      onChange={(event) =>
                        updateProductForm({ slug: slugify(event.target.value) })
                      }
                      className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                    />
                  </label>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-vintage-charcoal">
                      Price
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={productForm.price}
                      onChange={(event) =>
                        updateProductForm({ price: event.target.value })
                      }
                      className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                      placeholder="Leave blank for POA"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-vintage-charcoal">
                      Category
                    </span>
                    <select
                      value={productForm.category}
                      onChange={(event) =>
                        updateProductForm({
                          category: event.target.value as ProductCategory,
                        })
                      }
                      className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green bg-white"
                    >
                      {PRODUCT_CATEGORIES.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-vintage-charcoal">
                      Status
                    </span>
                    <select
                      value={productForm.status}
                      onChange={(event) =>
                        updateProductForm({
                          status: event.target.value as ProductStatus,
                        })
                      }
                      className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green bg-white"
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                    </select>
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-vintage-charcoal">
                    Dimensions
                  </span>
                  <input
                    value={productForm.dimensions}
                    onChange={(event) =>
                      updateProductForm({ dimensions: event.target.value })
                    }
                    className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                    placeholder="H: 102cm x W: 76cm"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-vintage-charcoal">
                    Description
                  </span>
                  <textarea
                    rows={4}
                    value={productForm.description}
                    onChange={(event) =>
                      updateProductForm({ description: event.target.value })
                    }
                    className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                  />
                </label>

                <div className="space-y-3">
                  <span className="text-sm font-bold text-vintage-charcoal">
                    Images
                  </span>
                  <label className="focus-within:outline-2 focus-within:outline-forest-green border-2 border-dashed border-vintage-charcoal/20 rounded-sm p-6 flex flex-col items-center justify-center text-vintage-charcoal/80 hover:bg-vintage-cream/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mb-2" />
                    <span>
                      {isUploading ? "Uploading..." : "Upload product photos"}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                      multiple
                      className="sr-only"
                      onChange={(event) => handleUpload(event.target.files)}
                      disabled={isUploading}
                    />
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {productForm.imageUrls.map((url, index) => (
                      <div
                        key={url}
                        className="border border-vintage-charcoal/10 rounded-sm p-3 space-y-2"
                      >
                        <div className="relative h-28 w-full overflow-hidden rounded-sm">
                          <Image
                            src={url}
                            alt={`Product upload ${index + 1}`}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-contain bg-vintage-cream/40"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const next = [...productForm.imageUrls];
                              const [removed] = next.splice(index, 1);
                              next.splice(Math.max(0, index - 1), 0, removed);
                              updateProductForm({ imageUrls: next });
                            }}
                            disabled={index === 0}
                          >
                            Up
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const next = [...productForm.imageUrls];
                              const [removed] = next.splice(index, 1);
                              next.splice(
                                Math.min(next.length, index + 1),
                                0,
                                removed,
                              );
                              updateProductForm({ imageUrls: next });
                            }}
                            disabled={
                              index === productForm.imageUrls.length - 1
                            }
                          >
                            Down
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateProductForm({
                                imageUrls: productForm.imageUrls.filter(
                                  (_, i) => i !== index,
                                ),
                              })
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-forest-green hover:bg-forest-green/90"
                  disabled={isLoading}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isLoading
                    ? "Saving..."
                    : productForm.id
                      ? "Save Changes"
                      : "Publish Item"}
                </Button>
              </fieldset>
            </form>
          </section>

          <section
            id="current-products"
            className="min-w-0 bg-white p-4 sm:p-6 md:p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-4"
          >
            <div className="border-b border-vintage-charcoal/10 pb-4">
              <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">
                Current Products
              </h2>
              <p className="text-sm text-vintage-charcoal/80">
                {products.length} items in inventory.
              </p>
            </div>
            <input
              type="search"
              aria-label="Search current products"
              placeholder="Current Products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full p-3 border border-vintage-charcoal/20 rounded-sm"
            />
            <div className="space-y-3 lg:max-h-[760px] lg:overflow-auto pr-1">
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-vintage-charcoal/10 rounded-sm p-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="h-16 w-16 bg-vintage-cream rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={product.imageUrls[0] || PRODUCT_IMAGE_PLACEHOLDER}
                        alt={
                          product.imageUrls[0]
                            ? product.title
                            : `Placeholder for ${product.title}`
                        }
                        width={64}
                        height={64}
                        className="h-full w-full object-contain bg-vintage-cream/40"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-vintage-charcoal break-words">
                        {product.title}
                      </h3>
                      <p className="text-sm text-vintage-charcoal/80">
                        {product.category} · {product.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => selectProduct(product)}
                      disabled={isLoading || isUploading || !dataReady}
                      aria-label={`Edit ${product.title}`}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteProduct(product)}
                      disabled={isLoading || isUploading || !dataReady}
                      aria-label={`Delete ${product.title}`}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section
          id="site-details"
          className="min-w-0 bg-white p-4 sm:p-6 md:p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-6"
        >
          <div className="border-b border-vintage-charcoal/10 pb-4">
            <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">
              Site Details
            </h2>
            <p className="text-sm text-vintage-charcoal/80">
              These details appear on the contact page and footer.
            </p>
          </div>
          <form onSubmit={handleSettingsSubmit}>
            <fieldset
              disabled={isLoading || isUploading || !dataReady}
              className="grid md:grid-cols-2 gap-5 min-w-0"
            >
              <label className="block space-y-2">
                <span className="text-sm font-bold text-vintage-charcoal">
                  Business Name
                </span>
                <input
                  value={settings.businessName}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      businessName: event.target.value,
                    })
                  }
                  className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-bold text-vintage-charcoal">
                  Phone
                </span>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(event) =>
                    setSettings({ ...settings, phone: event.target.value })
                  }
                  className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-bold text-vintage-charcoal">
                  WhatsApp Number
                </span>
                <input
                  type="tel"
                  value={settings.whatsappNumber}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      whatsappNumber: event.target.value,
                    })
                  }
                  className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-bold text-vintage-charcoal">
                  Email
                </span>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(event) =>
                    setSettings({ ...settings, email: event.target.value })
                  }
                  className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                />
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-bold text-vintage-charcoal">
                  Address Lines
                </span>
                <textarea
                  rows={3}
                  value={settingsText.addressLines}
                  onChange={(event) =>
                    setSettingsText({
                      ...settingsText,
                      addressLines: event.target.value,
                    })
                  }
                  className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                />
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-bold text-vintage-charcoal">
                  Google Maps Embed URL or Iframe HTML
                </span>
                <input
                  value={settings.mapEmbedUrl}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      mapEmbedUrl: event.target.value,
                    })
                  }
                  className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                />
                <span className="block text-xs text-vintage-charcoal/80">
                  Use Google Maps Share, Embed a map, then paste either the
                  iframe HTML or just its src URL.
                </span>
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-bold text-vintage-charcoal">
                  Opening Hours
                </span>
                <textarea
                  rows={4}
                  value={settingsText.openingHours}
                  onChange={(event) =>
                    setSettingsText({
                      ...settingsText,
                      openingHours: event.target.value,
                    })
                  }
                  className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                />
              </label>
              <div className="md:col-span-2">
                <Button type="submit" size="lg" disabled={isLoading}>
                  <Save className="w-5 h-5 mr-2" />
                  Save Site Details
                </Button>
              </div>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  );
}
