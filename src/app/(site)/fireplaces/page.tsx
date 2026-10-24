import { CategoryPage } from "@/components/storefront/CategoryPage";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata(
  "Reclaimed Fireplaces | Willesden Reclamation",
  "Browse restored Victorian and Edwardian fireplaces from Willesden Reclamation in London.",
  "/fireplaces",
);

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CategoryPage
      category="Fireplaces"
      description="Original Victorian and Edwardian fireplaces. A focal point with a history of its own."
    />
  );
}
