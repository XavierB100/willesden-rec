import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";

import { SITE_URL as siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts({ includeSold: true });

  const staticRoutes = [
    "",
    "/stock",
    "/fireplaces",
    "/doors",
    "/windows",
    "/selling",
    "/contact",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug || product.id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : undefined,
      changeFrequency: "daily" as const,
      priority: product.status === "available" ? 0.7 : 0.4,
    })),
  ];
}
