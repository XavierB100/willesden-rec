"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { adminRequest } from "@/lib/admin-request";
import { prepareImage } from "@/lib/prepare-image";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import {
  DEFAULT_SITE_SETTINGS,
  slugify,
  type Product,
  type ProductCategory,
  type SiteSettings,
} from "@/lib/catalogue";
import {
  emptyProductForm,
  productToForm,
  type ProductFormState,
} from "./product-form";

export type AdminView = "inventory" | "editor" | "settings";

/** Owns auth, drafts and mutations. View changes never discard either draft.
 * All writes still go through the owner-authorized server endpoints.
 */
export function useAdminWorkspace() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);
  const [view, setView] = useState<AdminView>("inventory");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "sold"
  >("all");
  const [reload, setReload] = useState(0);
  const [uploadProgress, setUploadProgress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const productDirty = JSON.stringify(productForm) !== productBaseline;
  const settingsDirty =
    dataReady &&
    JSON.stringify({ settings, settingsText }) !== settingsBaseline;
  const userId = session?.user.id;
  const visibleProducts = products.filter(
    (product) =>
      (statusFilter === "all" || product.status === statusFilter) &&
      (!selectedCategories.length ||
        selectedCategories.includes(product.category)) &&
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
  }, [userId, supabase, reload]);

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
    setMessage("");
    setError("");
    setView("editor");
    requestAnimationFrame(() =>
      document.querySelector<HTMLInputElement>('input[name="title"]')?.focus(),
    );
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
      resetProduct(productToForm(product));
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
      setView("inventory");
    });
  }

  async function handleUpload(files: FileList | File[] | null) {
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
      let completed = 0;
      for (const original of Array.from(files)) {
        setUploadProgress(
          `Preparing photo ${completed + 1} of ${files.length}…`,
        );
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
        completed += 1;
        setUploadProgress(`Uploaded ${completed} of ${files.length} photos`);
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
      setUploadProgress("");
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

  async function toggleStatus(product: Product) {
    if (productForm.id === product.id && productDirty) {
      setError(
        "Save or discard the open product edits before changing its status.",
      );
      return;
    }
    await runAction(async () => {
      const { product: saved } = await request<{ product: Product }>(
        `/api/admin/products/${product.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...product,
            status: product.status === "sold" ? "available" : "sold",
          }),
        },
      );
      setProducts((current) =>
        current.map((item) => (item.id === saved.id ? saved : item)),
      );
      if (productForm.id === saved.id) resetProduct(productToForm(saved));
      setMessage(`${saved.title} marked ${saved.status}.`);
    });
  }

  function discardProduct() {
    if (productDirty && !confirm("Discard unsaved product changes?")) return;
    const saved = products.find((item) => item.id === productForm.id);
    resetProduct(saved ? productToForm(saved) : emptyProductForm);
    setView("inventory");
  }

  return {
    configured: !!supabase,
    authReady,
    session,
    dataReady,
    email,
    setEmail,
    password,
    setPassword,
    products,
    visibleProducts,
    productForm,
    updateProductForm,
    productDirty,
    settings,
    setSettings,
    settingsText,
    setSettingsText,
    settingsDirty,
    search,
    setSearch,
    selectedCategories,
    setSelectedCategories,
    statusFilter,
    setStatusFilter,
    view,
    setView,
    message,
    error,
    isLoading,
    isUploading,
    uploadProgress,
    fileInputRef,
    handleLogin,
    handleLogout,
    selectProduct,
    handleProductSubmit,
    handleDeleteProduct,
    handleUpload,
    handleSettingsSubmit,
    toggleStatus,
    discardProduct,
    retry: () => setReload((value) => value + 1),
  };
}
export type AdminWorkspace = ReturnType<typeof useAdminWorkspace>;
