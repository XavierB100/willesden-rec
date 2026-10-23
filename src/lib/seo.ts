import type { Metadata } from "next";

export const SITE_URL = "https://www.willesdenreclamation.co.uk";
export const SITE_NAME = "Willesden Reclamation";
// Explicit launch switch; deploy previews must never become indexable.
export const IS_INDEXABLE =
  process.env.SITE_INDEXABLE === "true" &&
  (!process.env.CONTEXT || process.env.CONTEXT === "production");

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/wr-icon-512.png",
): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
