import { SITE_URL, IS_INDEXABLE } from "@/lib/seo";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

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
  return (
    <html lang="en-GB">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-vintage-cream text-vintage-charcoal flex flex-col min-h-screen`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
