import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";

const siteUrl = "https://willesdenreclamation.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts({ includeSold: true });
  const now = new Date();

  const staticRoutes = [
    "",
    "/stock",
    "/fireplaces",
    "/doors",
    "/selling",
    "/contact",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug || product.id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
      changeFrequency: "daily" as const,
      priority: product.status === "available" ? 0.7 : 0.4,
    })),
  ];
}
