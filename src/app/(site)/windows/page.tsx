import { CategoryPage } from "@/components/storefront/CategoryPage";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata(
  "Reclaimed Windows | Willesden Reclamation",
  "Browse reclaimed windows, frames, and architectural glazing from Willesden Reclamation.",
  "/windows",
);

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CategoryPage
      category="Windows"
      description="Reclaimed frames, stained glass and architectural glazing. A different way to see the light."
    />
  );
}
