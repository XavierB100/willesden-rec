import { PageIntro } from "@/components/storefront/PageIntro";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { buildWhatsAppUrl, getSiteSettings } from "@/lib/data";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Contact & Visit | Willesden Reclamation",
  "Visit Willesden Reclamation at 71 High Road, London NW10 2SU, call 07907 020 909, or enquire by WhatsApp.",
  "/contact",
);

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    "Hi, I'd like to ask about Willesden Reclamation stock.",
  );
  const telUrl = `tel:${settings.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="min-h-screen bg-vintage-cream">
      <PageIntro
        eyebrow="Find us in Willesden"
        title="Come and have a look."
        dark
      >
        <p>
          There’s nothing quite like seeing a piece in person. Drop by the yard,
          or get in touch about something you’ve spotted.
        </p>
      </PageIntro>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="contact-card space-y-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">
              Contact Details
            </h2>
            <div className="space-y-4 font-sans text-vintage-charcoal/80">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 mr-4 text-vintage-gold flex-shrink-0" />
                <div>
                  <p className="font-semibold text-vintage-charcoal">
                    {settings.businessName}
                  </p>
                  {settings.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <a
                href={telUrl}
                className="flex items-center hover:text-forest-green transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
              >
                <Phone className="w-6 h-6 mr-4 text-vintage-gold flex-shrink-0" />
                <span>{settings.phone}</span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center hover:text-forest-green transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
              >
                <Mail className="w-6 h-6 mr-4 text-vintage-gold flex-shrink-0" />
                <span>{settings.email}</span>
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <ButtonLink
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-forest-green hover:bg-vintage-moss text-white"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </ButtonLink>
              <ButtonLink
                href={telUrl}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call the Yard
              </ButtonLink>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-vintage-charcoal flex items-center">
              <Clock className="w-5 h-5 mr-2 text-vintage-gold" />
              Opening Hours
            </h2>
            <div className="space-y-2 font-sans text-vintage-charcoal/80">
              {settings.openingHours.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between max-w-sm border-b border-vintage-charcoal/10 pb-2 gap-6"
                >
                  <span>{row.label}</span>
                  <span className="font-semibold text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[420px] md:h-full min-h-[420px] bg-vintage-charcoal/5 rounded-md overflow-hidden relative border border-vintage-charcoal/10">
          <iframe
            title="Map to Willesden Reclamation"
            src={settings.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
        </div>
      </div>
    </div>
  );
}
