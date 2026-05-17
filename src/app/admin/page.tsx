"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "@/lib/data";
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
    const [session, setSession] = useState<Session | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
    const [settingsText, setSettingsText] = useState({
        addressLines: DEFAULT_SITE_SETTINGS.addressLines.join("\n"),
        openingHours: DEFAULT_SITE_SETTINGS.openingHours
            .map((row) => `${row.label}: ${row.value}`)
            .join("\n"),
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const authHeaders = session
        ? { Authorization: `Bearer ${session.access_token}` }
        : undefined;

    useEffect(() => {
        if (!supabase) return;

        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
        });

        return () => data.subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        if (session) {
            void loadAdminData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    async function loadAdminData() {
        if (!authHeaders) return;

        setIsLoading(true);
        setError("");

        try {
            const [productsResponse, settingsResponse] = await Promise.all([
                fetch("/api/admin/products", { headers: authHeaders }),
                fetch("/api/admin/settings", { headers: authHeaders }),
            ]);

            const productsJson = await productsResponse.json();
            const settingsJson = await settingsResponse.json();

            if (!productsResponse.ok) throw new Error(productsJson.error || "Could not load products.");
            if (!settingsResponse.ok) throw new Error(settingsJson.error || "Could not load settings.");

            setProducts(productsJson.products || []);
            setSettings(settingsJson.settings || DEFAULT_SITE_SETTINGS);
            setSettingsText({
                addressLines: (settingsJson.settings?.addressLines || DEFAULT_SITE_SETTINGS.addressLines).join("\n"),
                openingHours: (settingsJson.settings?.openingHours || DEFAULT_SITE_SETTINGS.openingHours)
                    .map((row: { label: string; value: string }) => `${row.label}: ${row.value}`)
                    .join("\n"),
            });
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Could not load admin data.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();
        if (!supabase) return;

        setIsLoading(true);
        setError("");
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        setIsLoading(false);

        if (loginError) {
            setError(loginError.message);
        }
    }

    async function handleLogout() {
        await supabase?.auth.signOut();
        setProducts([]);
        setProductForm(emptyProductForm);
    }

    function updateProductForm(update: Partial<ProductFormState>) {
        setProductForm((current) => {
            const next = { ...current, ...update };
            if (update.title && !current.id) next.slug = slugify(update.title);
            return next;
        });
    }

    async function handleProductSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!authHeaders) return;

        setIsLoading(true);
        setError("");
        setMessage("");

        const payload = {
            title: productForm.title,
            slug: productForm.slug,
            description: productForm.description,
            price: productForm.price ? Number(productForm.price) : null,
            category: productForm.category,
            dimensions: productForm.dimensions || null,
            status: productForm.status,
            imageUrls: productForm.imageUrls,
        };
        const endpoint = productForm.id
            ? `/api/admin/products/${productForm.id}`
            : "/api/admin/products";
        const response = await fetch(endpoint, {
            method: productForm.id ? "PUT" : "POST",
            headers: { ...authHeaders, "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const json = await response.json();

        setIsLoading(false);

        if (!response.ok) {
            setError(json.error || "Could not save product.");
            return;
        }

        setMessage(productForm.id ? "Product updated." : "Product added.");
        setProductForm(emptyProductForm);
        await loadAdminData();
    }

    async function handleDeleteProduct(product: Product) {
        if (!authHeaders || !confirm(`Delete "${product.title}"?`)) return;

        const response = await fetch(`/api/admin/products/${product.id}`, {
            method: "DELETE",
            headers: authHeaders,
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error || "Could not delete product.");
            return;
        }

        setMessage("Product deleted.");
        await loadAdminData();
    }

    async function handleUpload(files: FileList | null) {
        if (!files?.length || !authHeaders) return;

        setIsUploading(true);
        setError("");

        try {
            const uploadedUrls: string[] = [];
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);
                const response = await fetch("/api/admin/uploads", {
                    method: "POST",
                    headers: authHeaders,
                    body: formData,
                });
                const json = await response.json();
                if (!response.ok) throw new Error(json.error || "Image upload failed.");
                uploadedUrls.push(json.url);
            }
            updateProductForm({ imageUrls: [...productForm.imageUrls, ...uploadedUrls] });
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
        } finally {
            setIsUploading(false);
        }
    }

    async function handleSettingsSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!authHeaders) return;

        setIsLoading(true);
        setError("");
        setMessage("");

        const openingHours = settingsText.openingHours
            .split("\n")
            .map((line) => {
                const [label, ...rest] = line.split(":");
                return { label: label.trim(), value: rest.join(":").trim() };
            })
            .filter((row) => row.label && row.value);

        const payload: SiteSettings = {
            ...settings,
            addressLines: settingsText.addressLines.split("\n").map((line) => line.trim()).filter(Boolean),
            openingHours,
        };

        const response = await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { ...authHeaders, "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const json = await response.json();
        setIsLoading(false);

        if (!response.ok) {
            setError(json.error || "Could not save settings.");
            return;
        }

        setSettings(json.settings);
        setMessage("Site settings saved.");
    }

    if (!supabase) {
        return (
            <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-4">
                    <h1 className="text-3xl font-serif font-bold text-vintage-charcoal">Admin Setup Required</h1>
                    <p className="text-vintage-charcoal/70">
                        Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
                        `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_EMAIL` before using the admin dashboard.
                    </p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
                <form onSubmit={handleLogin} className="max-w-md mx-auto bg-white p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-6">
                    <div className="space-y-2 border-b border-vintage-charcoal/10 pb-4">
                        <h1 className="text-3xl font-serif font-bold text-vintage-charcoal">
                            Stock Management
                        </h1>
                        <p className="text-sm text-vintage-charcoal/60">
                            Sign in with the owner account to manage stock and site details.
                        </p>
                    </div>
                    {error && <p className="text-sm text-red-700">{error}</p>}
                    <label className="block space-y-2">
                        <span className="text-sm font-bold text-vintage-charcoal">Email</span>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                        />
                    </label>
                    <label className="block space-y-2">
                        <span className="text-sm font-bold text-vintage-charcoal">Password</span>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                        />
                    </label>
                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
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
                        <h1 className="text-4xl font-serif font-bold text-vintage-charcoal">Admin Dashboard</h1>
                        <p className="text-vintage-charcoal/60">Manage inventory, photos, and public contact details.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                    </Button>
                </div>

                {(message || error) && (
                    <div className={`border p-4 rounded-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-forest-green/20 bg-white text-forest-green"}`}>
                        {error || message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8">
                    <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-6">
                        <div className="flex items-center justify-between border-b border-vintage-charcoal/10 pb-4">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">
                                    {productForm.id ? "Edit Product" : "Add Product"}
                                </h2>
                                <p className="text-sm text-vintage-charcoal/60">Products saved here appear on the public stock pages.</p>
                            </div>
                            {productForm.id && (
                                <Button type="button" variant="ghost" onClick={() => setProductForm(emptyProductForm)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    New
                                </Button>
                            )}
                        </div>

                        <form onSubmit={handleProductSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-4">
                                <label className="block space-y-2">
                                    <span className="text-sm font-bold text-vintage-charcoal">Title</span>
                                    <input
                                        required
                                        value={productForm.title}
                                        onChange={(event) => updateProductForm({ title: event.target.value })}
                                        className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                                    />
                                </label>
                                <label className="block space-y-2">
                                    <span className="text-sm font-bold text-vintage-charcoal">Slug</span>
                                    <input
                                        required
                                        value={productForm.slug}
                                        onChange={(event) => updateProductForm({ slug: slugify(event.target.value) })}
                                        className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                                    />
                                </label>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <label className="block space-y-2">
                                    <span className="text-sm font-bold text-vintage-charcoal">Price</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={productForm.price}
                                        onChange={(event) => updateProductForm({ price: event.target.value })}
                                        className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                                        placeholder="Leave blank for POA"
                                    />
                                </label>
                                <label className="block space-y-2">
                                    <span className="text-sm font-bold text-vintage-charcoal">Category</span>
                                    <select
                                        value={productForm.category}
                                        onChange={(event) => updateProductForm({ category: event.target.value as ProductCategory })}
                                        className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green bg-white"
                                    >
                                        {PRODUCT_CATEGORIES.map((category) => (
                                            <option key={category}>{category}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block space-y-2">
                                    <span className="text-sm font-bold text-vintage-charcoal">Status</span>
                                    <select
                                        value={productForm.status}
                                        onChange={(event) => updateProductForm({ status: event.target.value as ProductStatus })}
                                        className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green bg-white"
                                    >
                                        <option value="available">Available</option>
                                        <option value="sold">Sold</option>
                                    </select>
                                </label>
                            </div>

                            <label className="block space-y-2">
                                <span className="text-sm font-bold text-vintage-charcoal">Dimensions</span>
                                <input
                                    value={productForm.dimensions}
                                    onChange={(event) => updateProductForm({ dimensions: event.target.value })}
                                    className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                                    placeholder="H: 102cm x W: 76cm"
                                />
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-bold text-vintage-charcoal">Description</span>
                                <textarea
                                    rows={4}
                                    value={productForm.description}
                                    onChange={(event) => updateProductForm({ description: event.target.value })}
                                    className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green"
                                />
                            </label>

                            <div className="space-y-3">
                                <span className="text-sm font-bold text-vintage-charcoal">Images</span>
                                <label className="border-2 border-dashed border-vintage-charcoal/20 rounded-sm p-6 flex flex-col items-center justify-center text-vintage-charcoal/50 hover:bg-vintage-cream/50 transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span>{isUploading ? "Uploading..." : "Upload product photos"}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="sr-only"
                                        onChange={(event) => handleUpload(event.target.files)}
                                        disabled={isUploading}
                                    />
                                </label>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {productForm.imageUrls.map((url, index) => (
                                        <div key={url} className="border border-vintage-charcoal/10 rounded-sm p-3 space-y-2">
                                            <div className="relative h-28 w-full overflow-hidden rounded-sm">
                                                <Image src={url} alt={`Product upload ${index + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                                            </div>
                                            <div className="flex gap-2">
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
                                                        next.splice(Math.min(next.length, index + 1), 0, removed);
                                                        updateProductForm({ imageUrls: next });
                                                    }}
                                                    disabled={index === productForm.imageUrls.length - 1}
                                                >
                                                    Down
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => updateProductForm({ imageUrls: productForm.imageUrls.filter((_, i) => i !== index) })}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full bg-forest-green hover:bg-forest-green/90" disabled={isLoading}>
                                <Save className="w-5 h-5 mr-2" />
                                {isLoading ? "Saving..." : productForm.id ? "Save Changes" : "Publish Item"}
                            </Button>
                        </form>
                    </section>

                    <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-4">
                        <div className="border-b border-vintage-charcoal/10 pb-4">
                            <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">Current Products</h2>
                            <p className="text-sm text-vintage-charcoal/60">{products.length} items in inventory.</p>
                        </div>
                        <div className="space-y-3 max-h-[760px] overflow-auto pr-1">
                            {products.map((product) => (
                                <div key={product.id} className="border border-vintage-charcoal/10 rounded-sm p-4 space-y-3">
                                    <div className="flex gap-3">
                                        <div className="h-16 w-16 bg-vintage-cream rounded-sm overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.imageUrls[0] || PRODUCT_IMAGE_PLACEHOLDER}
                                                alt={product.imageUrls[0] ? product.title : `Placeholder for ${product.title}`}
                                                width={64}
                                                height={64}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-serif font-bold text-vintage-charcoal truncate">{product.title}</h3>
                                            <p className="text-sm text-vintage-charcoal/60">{product.category} · {product.status}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" size="sm" variant="outline" onClick={() => setProductForm(productToForm(product))}>
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => handleDeleteProduct(product)}>
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-vintage-charcoal/5 space-y-6">
                    <div className="border-b border-vintage-charcoal/10 pb-4">
                        <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">Site Details</h2>
                        <p className="text-sm text-vintage-charcoal/60">These details appear on the contact page and footer.</p>
                    </div>
                    <form onSubmit={handleSettingsSubmit} className="grid md:grid-cols-2 gap-5">
                        <label className="block space-y-2">
                            <span className="text-sm font-bold text-vintage-charcoal">Business Name</span>
                            <input value={settings.businessName} onChange={(event) => setSettings({ ...settings, businessName: event.target.value })} className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green" />
                        </label>
                        <label className="block space-y-2">
                            <span className="text-sm font-bold text-vintage-charcoal">Phone</span>
                            <input value={settings.phone} onChange={(event) => setSettings({ ...settings, phone: event.target.value })} className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green" />
                        </label>
                        <label className="block space-y-2">
                            <span className="text-sm font-bold text-vintage-charcoal">WhatsApp Number</span>
                            <input value={settings.whatsappNumber} onChange={(event) => setSettings({ ...settings, whatsappNumber: event.target.value })} className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green" />
                        </label>
                        <label className="block space-y-2">
                            <span className="text-sm font-bold text-vintage-charcoal">Email</span>
                            <input type="email" value={settings.email} onChange={(event) => setSettings({ ...settings, email: event.target.value })} className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green" />
                        </label>
                        <label className="block space-y-2 md:col-span-2">
                            <span className="text-sm font-bold text-vintage-charcoal">Address Lines</span>
                            <textarea rows={3} value={settingsText.addressLines} onChange={(event) => setSettingsText({ ...settingsText, addressLines: event.target.value })} className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green" />
                        </label>
                        <label className="block space-y-2 md:col-span-2">
                            <span className="text-sm font-bold text-vintage-charcoal">Google Maps Embed URL</span>
                            <input value={settings.mapEmbedUrl} onChange={(event) => setSettings({ ...settings, mapEmbedUrl: event.target.value })} className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green" />
                        </label>
                        <label className="block space-y-2 md:col-span-2">
                            <span className="text-sm font-bold text-vintage-charcoal">Opening Hours</span>
                            <textarea rows={4} value={settingsText.openingHours} onChange={(event) => setSettingsText({ ...settingsText, openingHours: event.target.value })} className="w-full p-3 border border-vintage-charcoal/20 rounded-sm focus:outline-none focus:border-forest-green" />
                        </label>
                        <div className="md:col-span-2">
                            <Button type="submit" size="lg" disabled={isLoading}>
                                <Save className="w-5 h-5 mr-2" />
                                Save Site Details
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
