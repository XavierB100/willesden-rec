import { PRODUCT_CATEGORIES, slugify, type ProductInput } from "./catalogue";

function text(
  value: unknown,
  label: string,
  max: number,
  required = false,
): string {
  if (value === undefined || value === null) {
    if (required) throw new Error(`${label} is required.`);
    return "";
  }
  if (typeof value !== "string") throw new Error(`${label} must be text.`);
  const result = value.trim();
  if (required && !result) throw new Error(`${label} is required.`);
  if (result.length > max)
    throw new Error(`${label} must be ${max} characters or fewer.`);
  return result;
}

export function parseProductInput(value: unknown): ProductInput {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid product data.");
  const body = value as Record<string, unknown>;
  const title = text(body.title, "Title", 200, true);
  const slug = slugify(text(body.slug, "Slug", 200) || title);
  if (
    !slug ||
    /^[0-9]+$/.test(slug) ||
    /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(slug)
  )
    throw new Error("Choose a descriptive product slug.");
  const category = body.category as ProductInput["category"];
  if (!PRODUCT_CATEGORIES.includes(category))
    throw new Error("Choose a valid category.");
  const status = body.status ?? "available";
  if (status !== "available" && status !== "sold")
    throw new Error("Choose a valid status.");
  const price =
    body.price === null || body.price === undefined ? null : body.price;
  if (
    price !== null &&
    (typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      price > 99999999.99 ||
      Math.abs(price * 100 - Math.round(price * 100)) > 0.000001)
  ) {
    throw new Error(
      "Enter a valid price with up to two decimal places, or leave it blank for POA.",
    );
  }
  const imageUrls = body.imageUrls ?? [];
  if (!Array.isArray(imageUrls) || imageUrls.length > 20)
    throw new Error("Use up to 20 product photos.");
  const origin = process.env.NEXT_PUBLIC_SUPABASE_URL;
  for (const url of imageUrls) {
    if (
      typeof url !== "string" ||
      !origin ||
      !url.startsWith(`${origin}/storage/v1/object/public/product-images/`) ||
      url.includes("..") ||
      url.length > 2048
    )
      throw new Error("Use photos uploaded to this project.");
  }
  return {
    title,
    slug,
    category,
    status,
    price: price as number | null,
    description: text(body.description, "Description", 10000),
    dimensions: text(body.dimensions, "Dimensions", 300) || null,
    imageUrls: [...new Set(imageUrls)],
  };
}
