import Link from "next/link";
import { getSiteSettings } from "@/lib/data";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-forest-green text-vintage-cream pt-10 md:pt-16 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold tracking-tight">
              {settings.businessName}
            </h3>
            <p className="text-vintage-cream/80 text-sm leading-relaxed max-w-sm mx-auto md:mx-0 font-sans">
              London&apos;s destination for architectural salvage, restored
              Victorian fireplaces, antique doors, reclaimed windows, and unique
              yard stock.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-vintage-gold">
              Explore
            </h4>
            <nav
              aria-label="Explore"
              className="grid grid-rows-3 grid-flow-col grid-cols-2 gap-x-4 gap-y-2 text-sm font-sans"
            >
              {[
                { href: "/stock", label: "Current Stock" },
                { href: "/fireplaces", label: "Fireplaces" },
                { href: "/doors", label: "Doors" },
                { href: "/windows", label: "Windows" },
                { href: "/stock?category=Other", label: "Other" },
                { href: "/selling", label: "Sell to Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-vintage-cream/80 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-vintage-gold">
              Visit Us
            </h4>
            <div className="text-sm font-sans space-y-2 text-vintage-cream/80">
              {settings.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <a
                className="block pt-2 font-semibold text-white hover:text-vintage-gold transition-colors"
                href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
              >
                {settings.phone}
              </a>
              <a
                className="block break-words hover:text-vintage-gold transition-colors"
                href={`mailto:${settings.email}`}
              >
                {settings.email}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-vintage-cream/10 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-xs font-sans text-vintage-cream/80">
          <p>
            &copy; {new Date().getFullYear()} {settings.businessName}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
