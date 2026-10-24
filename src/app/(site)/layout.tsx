import "./storefront.css";
import { getSiteSettings } from "@/lib/data";
import { SITE_URL, jsonLd } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: settings.businessName,
    url: SITE_URL,
    image: `${SITE_URL}/wr-icon-512.png`,
    telephone: settings.phone,
    email: settings.email,
    address: settings.addressLines.join(", "),
    areaServed: "London",
    description:
      "Vintage and architectural salvage specialist selling reclaimed Victorian fireplaces, doors, windows, garden pieces, furniture, lighting, and other yard stock.",
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessJsonLd) }}
      />
      <Navbar whatsappNumber={settings.whatsappNumber} />
      <main id="main-content" tabIndex={-1} className="flex-grow min-w-0">
        {children}
      </main>
      <Footer />
    </>
  );
}
