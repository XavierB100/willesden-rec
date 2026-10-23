"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const links = [
    { href: '/', label: 'Home' },
    { href: '/stock', label: 'Current Stock' },
    { href: '/selling', label: 'We Buy' },
    { href: '/contact', label: 'Contact' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const whatsappUrl = "https://wa.me/447907020909?text=Hi%2C%20I%27d%20like%20to%20ask%20about%20Willesden%20Reclamation%20stock.";

    return (
        <nav className="sticky top-0 z-50 w-full bg-vintage-cream/90 backdrop-blur-md border-b border-vintage-charcoal/10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold">
                        <span className="text-2xl font-serif font-bold text-vintage-charcoal tracking-tight">
                            Willesden Reclamation
                        </span>
                        <span className="text-[10px] font-sans text-forest-green tracking-widest uppercase">
                            Est. 2018
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-vintage-charcoal/80 hover:text-forest-green font-sans text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="ml-4">
                            <Button size="sm" variant="primary">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat to Buy
                            </Button>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-vintage-charcoal"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-vintage-cream border-t border-vintage-charcoal/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-lg font-serif text-vintage-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="w-full">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Chat to Buy
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
