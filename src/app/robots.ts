import type { MetadataRoute } from "next";
import { SITE_URL, IS_INDEXABLE } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: IS_INDEXABLE
      ? { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    ...(IS_INDEXABLE
      ? { sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL }
      : {}),
  };
}
