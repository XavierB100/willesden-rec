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
  demo?: boolean;
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
  demo?: boolean;
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

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  businessName: "Willesden Reclamation",
  phone: "07907 020 909",
  whatsappNumber: "447907020909",
  email: "info@willesdenreclamation.co.uk",
  addressLines: ["71 High Road Ellis Cl", "London", "NW10 2SU"],
  mapEmbedUrl:
    "https://www.google.com/maps?q=Willesden%20Reclamation%2C%2071%20High%20Road%2C%20London%20NW10%202SU&output=embed",
  openingHours: [
    { label: "Monday - Friday", value: "8:00 AM - 5:00 PM" },
    { label: "Saturday", value: "10:00 AM - 4:00 PM" },
    { label: "Sunday", value: "Closed" },
  ],
};

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
