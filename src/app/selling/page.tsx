import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { buildWhatsAppUrl, getSiteSettings } from "@/lib/data";
import { MessageCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Sell Architectural Salvage | Willesden Reclamation",
  "Sell reclaimed fireplaces, doors, windows, radiators, stained glass, garden ornaments, and architectural stone to Willesden Reclamation.",
  "/selling",
);

export const dynamic = "force-dynamic";

export default async function SellingPage() {
  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    "Hi, I have some reclaimed items to sell. I can send photos, dimensions, my location, and a rough price expectation.",
  );

  return (
    <div className="min-h-screen bg-vintage-cream py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-charcoal">
            Sell to Us
          </h1>
          <p className="text-lg text-vintage-charcoal/80 font-sans max-w-2xl mx-auto">
            We are always looking to buy high-quality reclaimed items. If you
            have architectural salvage you would like to sell, we would love to
            see it.
          </p>
        </div>

        <div className="bg-white p-5 sm:p-8 md:p-12 border border-vintage-charcoal/10 shadow-sm space-y-8 rounded-sm">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-vintage-moss">
              What We Buy
            </h2>
            <ul className="flex flex-col gap-3 text-sm sm:text-base font-sans text-vintage-charcoal/80">
              {[
                "Victorian Fireplaces",
                "Cast Iron Radiators",
                "Old Pine Doors",
                "Reclaimed Windows",
                "Stained Glass",
                "Garden Ornaments",
                "Architectural Stone",
              ].map((item) => (
                <li key={item} className="flex items-start">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-vintage-gold flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 border-t border-vintage-charcoal/10 pt-8">
            <h2 className="text-2xl font-serif font-bold text-vintage-moss">
              How to Sell
            </h2>
            <p className="font-sans text-vintage-charcoal/80">
              The easiest way to get a quote is to send photos via WhatsApp.
              Please include clear photos, dimensions, your location, and a
              rough price expectation.
            </p>

            <div className="pt-4">
              <ButtonLink
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold bg-[#25D366] hover:bg-[#128C7E] text-vintage-charcoal"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Photos via WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
