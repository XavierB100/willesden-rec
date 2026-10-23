import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const PRODUCT_CATEGORIES = [
    "Fireplaces",
    "Doors",
    "Windows",
    "Lighting",
    "Garden",
    "Furniture",
    "Other",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductStatus = "available" | "sold";

export interface Product {
    id: string;
    legacyId?: string | null;
    title: string;
    slug: string;
    description: string;
    price: number | null;
    category: ProductCategory;
    imageUrls: string[];
    status: ProductStatus;
    dimensions?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface ProductInput {
    title: string;
    slug?: string;
    description: string;
    price: number | null;
    category: ProductCategory;
    imageUrls: string[];
    status: ProductStatus;
    dimensions?: string | null;
}

export interface OpeningHours {
    label: string;
    value: string;
}

export interface SiteSettings {
    businessName: string;
    phone: string;
    whatsappNumber: string;
    email: string;
    addressLines: string[];
    mapEmbedUrl: string;
    openingHours: OpeningHours[];
}

export const PRODUCT_IMAGE_PLACEHOLDER = "/images/product-placeholder.svg";

interface ProductRow {
    id: string;
    legacy_id?: string | null;
    title: string;
    slug: string | null;
    description: string | null;
    price: number | null;
    category: ProductCategory;
    image_urls: string[] | null;
    status: ProductStatus;
    dimensions: string | null;
    created_at: string | null;
    updated_at: string | null;
}

interface SiteSettingsRow {
    business_name: string | null;
    phone: string | null;
    whatsapp_number: string | null;
    email: string | null;
    address_lines: string[] | null;
    map_embed_url: string | null;
    opening_hours: OpeningHours[] | null;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
    businessName: "Willesden Reclamation",
    phone: "07907 020 909",
    whatsappNumber: "447907020909",
    email: "info@willesdenreclamation.co.uk",
    addressLines: ["71 High Road", "London", "NW10 2SU"],
    mapEmbedUrl:
        "https://www.google.com/maps?q=71%20High%20Road%2C%20London%20NW10%202SU&output=embed",
    openingHours: [
        { label: "Monday - Friday", value: "8:00 AM - 5:00 PM" },
        { label: "Saturday", value: "10:00 AM - 4:00 PM" },
        { label: "Sunday", value: "Closed" },
    ],
};

export const DEFAULT_PRODUCTS: Product[] = [
    {
        id: "1",
        legacyId: "1",
        title: "Victorian Cast Iron Combination Fireplace",
        slug: "victorian-cast-iron-combination-fireplace",
        description:
            "A stunning original Victorian cast iron combination fireplace with intricate fruit and floral detailing. Fully restored and burnished.",
        price: 850,
        category: "Fireplaces",
        imageUrls: [],
        status: "available",
        dimensions: "H: 102cm x W: 76cm",
    },
    {
        id: "2",
        legacyId: "2",
        title: "Reclaimed Victorian 4-Panel Pine Door",
        slug: "reclaimed-victorian-4-panel-pine-door",
        description:
            "Original 19th-century stripped pine door. Classic 4-panel design, ready for waxing or painting.",
        price: 180,
        category: "Doors",
        imageUrls: [],
        status: "available",
        dimensions: "H: 198cm x W: 76cm",
    },
    {
        id: "3",
        legacyId: "3",
        title: "Edwardian Tiled Insert",
        slug: "edwardian-tiled-insert",
        description:
            "Beautiful original Edwardian tiled insert with original tube-lined tiles in art nouveau style.",
        price: 1200,
        category: "Fireplaces",
        imageUrls: [],
        status: "available",
        dimensions: "H: 96cm x W: 96cm",
    },
    {
        id: "4",
        legacyId: "4",
        title: "Stone Garden Trough",
        slug: "stone-garden-trough",
        description:
            "Hand-carved sandstone trough, perfect for a garden planter. Weathered beautifully over time.",
        price: 450,
        category: "Garden",
        imageUrls: [],
        status: "available",
        dimensions: "L: 120cm x D: 40cm",
    },
    {
        id: "5",
        legacyId: "5",
        title: "Ornate Cast Iron Radiator",
        slug: "ornate-cast-iron-radiator",
        description:
            "Original distinct ornate cast iron radiator. Pressure tested and ready to plumb in.",
        price: 550,
        category: "Furniture",
        imageUrls: [],
        status: "sold",
        dimensions: "W: 80cm x H: 75cm",
    },
    {
        id: "6",
        legacyId: "6",
        title: "Stained Glass Panel",
        slug: "stained-glass-panel",
        description:
            "Geometric Art Deco stained glass panel reclaimed from details of a 1930s front door.",
        price: 295,
        category: "Doors",
        imageUrls: [],
        status: "available",
        dimensions: "H: 60cm x W: 40cm",
    },
    {
        id: "7",
        legacyId: "7",
        title: "Georgian Brass Fender",
        slug: "georgian-brass-fender",
        description:
            "A heavy polished brass fender from the Georgian period. Pierced fretwork design with lion paw feet.",
        price: 325,
        category: "Fireplaces",
        imageUrls: [],
        status: "available",
        dimensions: "W: 135cm",
    },
    {
        id: "8",
        legacyId: "8",
        title: "Reclaimed Oak Beams",
        slug: "reclaimed-oak-beams",
        description:
            "Solid oak structural beams reclaimed from a French barn. Full of character and age.",
        price: 120,
        category: "Garden",
        imageUrls: [],
        status: "available",
        dimensions: "L: 2.2m x W: 20cm",
    },
];

export const products = DEFAULT_PRODUCTS;

export function formatPrice(price: number | null) {
    if (price === null) return "POA";
    const hasPence = !Number.isInteger(price);
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: hasPence ? 2 : 0,
        maximumFractionDigits: 2,
    }).format(price);
}

export function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function buildWhatsAppUrl(number: string, message: string) {
    const normalized = number.replace(/[^0-9]/g, "");
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function cleanImageUrls(urls: string[] | null | undefined) {
    return (urls || []).filter((url) => {
        if (!url) return false;
        // The early demo seed used unstable Unsplash URLs that now return 404.
        if (url.includes("images.unsplash.com")) return false;
        return true;
    });
}

export function hasSupabaseEnv() {
    return Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
}

export function getSupabasePublicClient(): SupabaseClient | null {
    if (!hasSupabaseEnv()) return null;

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        },
    );
}

export function getSupabaseServiceClient(): SupabaseClient {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error("Supabase service environment variables are missing.");
    }

    return createClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

export function mapProduct(row: ProductRow): Product {
    return {
        id: row.id,
        legacyId: row.legacy_id,
        title: row.title,
        slug: row.slug || slugify(row.title),
        description: row.description || "",
        price: row.price,
        category: row.category,
        imageUrls: cleanImageUrls(row.image_urls),
        status: row.status,
        dimensions: row.dimensions,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function mapProductInput(input: ProductInput) {
    return {
        title: input.title.trim(),
        slug: slugify(input.slug || input.title),
        description: input.description.trim(),
        price: input.price,
        category: input.category,
        image_urls: cleanImageUrls(input.imageUrls),
        status: input.status,
        dimensions: input.dimensions?.trim() || null,
    };
}

export async function getProducts(options?: {
    category?: ProductCategory;
    includeSold?: boolean;
    limit?: number;
}) {
    const fallback = DEFAULT_PRODUCTS
        .filter((product) => !options?.category || product.category === options.category)
        .filter((product) => options?.includeSold !== false || product.status === "available")
        .slice(0, options?.limit || DEFAULT_PRODUCTS.length);

    const supabase = getSupabasePublicClient();
    if (!supabase) return fallback;

    let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (options?.category) query = query.eq("category", options.category);
    if (options?.includeSold === false) query = query.eq("status", "available");
    if (options?.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error) {
        console.error("Failed to load Supabase products", error.message);
        return fallback;
    }

    return (data || []).map((row) => mapProduct(row as ProductRow));
}

export async function getProductByIdentifier(identifier: string) {
    const fallback = DEFAULT_PRODUCTS.find(
        (product) =>
            product.id === identifier ||
            product.slug === identifier ||
            product.legacyId === identifier,
    );

    const supabase = getSupabasePublicClient();
    if (!supabase) return fallback || null;

    const { data, error } = await supabase.from("products").select("*");
    if (error) {
        console.error("Failed to load Supabase product", error.message);
        return fallback || null;
    }

    const row = (data || []).find((product) => {
        const typed = product as ProductRow;
        return (
            typed.id === identifier ||
            typed.slug === identifier ||
            typed.legacy_id === identifier
        );
    });

    return row ? mapProduct(row as ProductRow) : fallback || null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
    const supabase = getSupabasePublicClient();
    if (!supabase) return DEFAULT_SITE_SETTINGS;

    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", true)
        .maybeSingle();

    if (error || !data) {
        if (error) console.error("Failed to load Supabase site settings", error.message);
        return DEFAULT_SITE_SETTINGS;
    }

    const row = data as SiteSettingsRow;

    return {
        businessName: row.business_name || DEFAULT_SITE_SETTINGS.businessName,
        phone: row.phone || DEFAULT_SITE_SETTINGS.phone,
        whatsappNumber: row.whatsapp_number || DEFAULT_SITE_SETTINGS.whatsappNumber,
        email: row.email || DEFAULT_SITE_SETTINGS.email,
        addressLines: row.address_lines?.length
            ? row.address_lines
            : DEFAULT_SITE_SETTINGS.addressLines,
        mapEmbedUrl: row.map_embed_url || DEFAULT_SITE_SETTINGS.mapEmbedUrl,
        openingHours: row.opening_hours?.length
            ? row.opening_hours
            : DEFAULT_SITE_SETTINGS.openingHours,
    };
}
