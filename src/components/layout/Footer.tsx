import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-forest-green text-vintage-cream pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold tracking-tight">
                            Willesden Reclamation
                        </h3>
                        <p className="text-vintage-cream/80 text-sm leading-relaxed max-w-sm mx-auto md:mx-0 font-sans">
                            London's premier destination for architectural salvage.
                            Restoring character to modern homes with Victorian fireplaces,
                            antique doors, and unique yard stock.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-serif font-semibold text-vintage-gold">Explore</h4>
                        <nav className="flex flex-col space-y-2 text-sm font-sans">
                            <Link href="/stock" className="text-vintage-cream/80 hover:text-white transition-colors">
                                Current Stock
                            </Link>
                            <Link href="/fireplaces" className="text-vintage-cream/80 hover:text-white transition-colors">
                                Fireplaces
                            </Link>
                            <Link href="/doors" className="text-vintage-cream/80 hover:text-white transition-colors">
                                Doors & Windows
                            </Link>
                            <Link href="/selling" className="text-vintage-cream/80 hover:text-white transition-colors">
                                Sell to Us
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-serif font-semibold text-vintage-gold">Visit Us</h4>
                        <div className="text-sm font-sans space-y-2 text-vintage-cream/80">
                            <p>71 High Road</p>
                            <p>London, NW10 2SU</p>
                            <p className="pt-2 font-semibold text-white">07907 020 909</p>
                            <p>info@willesdenreclamation.co.uk</p>
                        </div>
                    </div>

                </div>

                <div className="border-t border-vintage-cream/10 mt-12 pt-8 text-center text-xs font-sans text-vintage-cream/40">
                    <p>&copy; {new Date().getFullYear()} Willesden Reclamation. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
