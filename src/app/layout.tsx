import { getSiteSettings } from "@/lib/data";
import { SITE_URL, IS_INDEXABLE, jsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Willesden Reclamation | Vintage & Architectural Salvage",
    template: "%s | Willesden Reclamation",
  },
  description:
    "Specialists in reclaimed Victorian fireplaces, doors, windows, and architectural antiques in London NW10.",
  robots: IS_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/wr-icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "512x512", type: "image/png" }],
  },
  openGraph: {
    siteName: "Willesden Reclamation",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en-GB">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-vintage-cream text-vintage-charcoal flex flex-col min-h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessJsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar whatsappNumber={settings.whatsappNumber} />
        <main id="main-content" tabIndex={-1} className="flex-grow min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
