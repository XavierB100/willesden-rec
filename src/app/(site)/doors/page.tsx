import { CategoryPage } from "@/components/storefront/CategoryPage";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata(
  "Reclaimed Doors | Willesden Reclamation",
  "Browse reclaimed period pine doors and stained glass from Willesden Reclamation.",
  "/doors",
);

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CategoryPage
      category="Doors"
      description="Period doors, old pine and stained glass. Make an entrance with something original."
    />
  );
}
