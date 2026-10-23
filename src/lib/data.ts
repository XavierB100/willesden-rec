import "server-only";
import { cache } from "react";
import {
  DEFAULT_SITE_SETTINGS,
  slugify,
  type Product,
  type ProductInput,
  type ProductCategory,
  type ProductStatus,
  type SiteSettings,
  type OpeningHours,
} from "./catalogue";
export * from "./catalogue";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
  const supabase = getSupabasePublicClient();
  if (!supabase) throw new Error("Stock is temporarily unavailable.");

  let query = supabase
    .from("products")
    .select("*")
    .abortSignal(AbortSignal.timeout(8000))
    .order("created_at", { ascending: false });

  if (options?.category) query = query.eq("category", options.category);
  if (options?.includeSold === false) query = query.eq("status", "available");
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) {
    console.error("Failed to load Supabase products", error.message);
    throw new Error("Stock is temporarily unavailable.");
  }

  return (data || []).map((row) => mapProduct(row as ProductRow));
}

export const getProductByIdentifier = cache(async (identifier: string) => {
  // Restrict PostgREST filter syntax and avoid a full-table fetch for each listing.
  if (!/^[a-zA-Z0-9-]{1,200}$/.test(identifier)) return null;
  const supabase = getSupabasePublicClient();
  if (!supabase) throw new Error("Stock is temporarily unavailable.");
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      identifier,
    );
  const filters = [`slug.eq.${identifier}`, `legacy_id.eq.${identifier}`];
  if (isUuid) filters.push(`id.eq.${identifier}`);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(filters.join(","))
    .limit(1)
    .abortSignal(AbortSignal.timeout(8000))
    .maybeSingle();
  if (error) {
    console.error("Failed to load product", error.code);
    throw new Error("Stock is temporarily unavailable.");
  }
  return data ? mapProduct(data as ProductRow) : null;
});

export const getSiteSettings = cache(
  async (strict = false): Promise<SiteSettings> => {
    const supabase = getSupabasePublicClient();
    if (!supabase) {
      if (strict) throw new Error("Could not load settings.");
      return DEFAULT_SITE_SETTINGS;
    }

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", true)
      .abortSignal(AbortSignal.timeout(8000))
      .maybeSingle();

    if (error || !data) {
      if (strict) throw new Error("Could not load settings.");
      if (error)
        console.error("Failed to load Supabase site settings", error.message);
      return DEFAULT_SITE_SETTINGS;
    }

    const row = data as SiteSettingsRow;

    return {
      businessName: row.business_name || DEFAULT_SITE_SETTINGS.businessName,
      phone: row.phone || DEFAULT_SITE_SETTINGS.phone,
      whatsappNumber:
        row.whatsapp_number || DEFAULT_SITE_SETTINGS.whatsappNumber,
      email: row.email || DEFAULT_SITE_SETTINGS.email,
      addressLines: row.address_lines?.length
        ? row.address_lines
        : DEFAULT_SITE_SETTINGS.addressLines,
      mapEmbedUrl: row.map_embed_url || DEFAULT_SITE_SETTINGS.mapEmbedUrl,
      openingHours: row.opening_hours?.length
        ? row.opening_hours
        : DEFAULT_SITE_SETTINGS.openingHours,
    };
  },
);
