"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/catalogue";

const links = [
  { href: "/", label: "Home" },
  { href: "/stock", label: "Current Stock" },
  { href: "/selling", label: "We Buy" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ whatsappNumber }: { whatsappNumber: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hi, I'd like to ask about Willesden Reclamation stock.",
  );
  useEffect(() => {
    if (!isOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [isOpen]);
  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 w-full bg-vintage-cream/90 backdrop-blur-md border-b border-vintage-charcoal/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-3 h-20">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex min-w-0 flex-col"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold text-vintage-charcoal tracking-tight">
              Willesden Reclamation
            </span>
            <span className="text-[10px] font-sans text-forest-green tracking-widest uppercase">
              Est. 2018
            </span>
          </Link>
          <div className="hidden lg:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="text-vintage-charcoal/80 hover:text-forest-green font-sans text-sm font-medium py-3"
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat to Buy
            </ButtonLink>
          </div>
          <button
            ref={toggle}
            type="button"
            className="lg:hidden p-3 shrink-0 text-vintage-charcoal"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <div
        id="mobile-navigation"
        hidden={!isOpen}
        className="lg:hidden bg-vintage-cream border-t border-vintage-charcoal/10 max-h-[calc(100dvh-5rem)] overflow-y-auto"
      >
        <div className="flex flex-col p-4 gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="text-lg font-serif text-vintage-charcoal py-3"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat to Buy
          </ButtonLink>
        </div>
      </div>
    </nav>
  );
}
