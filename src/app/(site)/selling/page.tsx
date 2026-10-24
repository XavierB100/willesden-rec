import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PageIntro } from "@/components/storefront/PageIntro";
import { buildWhatsAppUrl, getSiteSettings } from "@/lib/data";
import { MessageCircle, ArrowUpRight } from "lucide-react";

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
    <>
      <PageIntro
        eyebrow="We buy architectural salvage"
        title="Too good to throw away."
        dark
      >
        <p>
          Have something with a little history? We’re always interested in
          quality reclaimed pieces. Let’s see what you’ve found.
        </p>
      </PageIntro>
      <div className="site-container section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The pieces we look for</p>
            <h2>Character worth keeping.</h2>
          </div>
        </div>
        <ul className="collection-grid">
          {[
            "Victorian fireplaces",
            "Cast iron radiators",
            "Old pine doors",
            "Reclaimed windows",
            "Stained glass",
            "Garden ornaments",
            "Architectural stone",
          ].map((item) => (
            <li key={item} className="collection-link">
              <span className="font-serif">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <section className="site-container section-space border-t border-vintage-charcoal/15">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Start with a conversation</p>
            <h2>Three simple steps.</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Show us the piece",
              copy: "Take clear photographs from a few angles. Include close-ups of details, maker’s marks and any damage.",
            },
            {
              title: "Add the details",
              copy: "Tell us the measurements, where it’s located and the price you have in mind. Every bit of context helps.",
            },
            {
              title: "Let’s talk",
              copy: "Send it all on WhatsApp. We’ll review the piece and discuss whether it’s right for the yard.",
            },
          ].map((step, i) => (
            <div key={step.title} className="contact-card">
              <p className="step-number">0{i + 1}</p>
              <h3 className="font-serif text-2xl mt-3 mb-4">{step.title}</h3>
              <p className="text-sm text-vintage-charcoal/80 leading-relaxed">
                {step.copy}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <ButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="bg-forest-green text-white hover:bg-vintage-moss"
          >
            <MessageCircle size={20} /> Send your photos
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Prefer to call? <ArrowUpRight size={17} />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
