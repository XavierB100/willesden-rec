import Link from 'next/link';
import { getSiteSettings } from '@/lib/data';

export async function Footer() {
    const settings = await getSiteSettings();

    return (
        <footer className="bg-forest-green text-vintage-cream pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold tracking-tight">
                            {settings.businessName}
                        </h3>
                        <p className="text-vintage-cream/80 text-sm leading-relaxed max-w-sm mx-auto md:mx-0 font-sans">
                            London&apos;s destination for architectural salvage,
                            restored Victorian fireplaces, antique doors, and unique yard stock.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-serif font-semibold text-vintage-gold">Explore</h4>
                        <nav className="flex flex-col space-y-2 text-sm font-sans">
                            {[
                                { href: "/stock", label: "Current Stock" },
                                { href: "/fireplaces", label: "Fireplaces" },
                                { href: "/doors", label: "Doors & Windows" },
                                { href: "/selling", label: "Sell to Us" },
                            ].map((link) => (
                                <Link key={link.href} href={link.href} className="text-vintage-cream/80 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-serif font-semibold text-vintage-gold">Visit Us</h4>
                        <div className="text-sm font-sans space-y-2 text-vintage-cream/80">
                            {settings.addressLines.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                            <p className="pt-2 font-semibold text-white">{settings.phone}</p>
                            <p>{settings.email}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-vintage-cream/10 mt-12 pt-8 text-center text-xs font-sans text-vintage-cream/40">
                    <p>&copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
