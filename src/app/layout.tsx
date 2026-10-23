import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Willesden Reclamation",
  url: "https://willesdenreclamation.co.uk",
  image: "https://willesdenreclamation.co.uk/wr-icon-512.png",
  telephone: "+447907020909",
  address: {
    "@type": "PostalAddress",
    streetAddress: "71 High Road",
    addressLocality: "London",
    postalCode: "NW10 2SU",
    addressCountry: "GB",
  },
  areaServed: "London",
  description:
    "Vintage and architectural salvage specialist selling reclaimed Victorian fireplaces, doors, windows, garden pieces, furniture, lighting, and other yard stock.",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://willesdenreclamation.co.uk"),
  title: {
    default: "Willesden Reclamation | Vintage & Architectural Salvage",
    template: "%s | Willesden Reclamation",
  },
  description: "Specialists in reclaimed Victorian fireplaces, doors, windows, and architectural antiques in London NW10.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-vintage-cream text-vintage-charcoal flex flex-col min-h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        {process.env.VERCEL === "1" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
