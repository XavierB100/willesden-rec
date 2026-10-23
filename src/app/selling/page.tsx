import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl, getSiteSettings } from "@/lib/data";
import { MessageCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Sell Architectural Salvage | Willesden Reclamation",
    description:
        "Sell reclaimed fireplaces, doors, windows, radiators, stained glass, garden ornaments, and architectural stone to Willesden Reclamation.",
};

export const dynamic = "force-dynamic";

export default async function SellingPage() {
    const settings = await getSiteSettings();
    const whatsappUrl = buildWhatsAppUrl(
        settings.whatsappNumber,
        "Hi, I have some reclaimed items to sell. I can send photos, dimensions, my location, and a rough price expectation.",
    );

    return (
        <div className="min-h-screen bg-vintage-cream py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-charcoal">
                        Sell to Us
                    </h1>
                    <p className="text-lg text-vintage-charcoal/70 font-sans max-w-2xl mx-auto">
                        We are always looking to buy high-quality reclaimed items.
                        If you have architectural salvage you would like to sell, we would love to see it.
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 border border-vintage-charcoal/10 shadow-sm space-y-8 rounded-sm">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-vintage-moss">What We Buy</h2>
                        <ul className="grid md:grid-cols-2 gap-4 font-sans text-vintage-charcoal/80">
                            {[
                                "Victorian Fireplaces",
                                "Cast Iron Radiators",
                                "Old Pine Doors",
                                "Reclaimed Windows",
                                "Stained Glass",
                                "Garden Ornaments",
                                "Architectural Stone",
                            ].map((item) => (
                                <li key={item} className="flex items-start">
                                    <ArrowRight className="w-5 h-5 mr-2 text-vintage-gold flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6 border-t border-vintage-charcoal/10 pt-8">
                        <h2 className="text-2xl font-serif font-bold text-vintage-moss">How to Sell</h2>
                        <p className="font-sans text-vintage-charcoal/80">
                            The easiest way to get a quote is to send photos via WhatsApp.
                            Please include clear photos, dimensions, your location, and a rough price expectation.
                        </p>

                        <div className="pt-4">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
                            >
                                <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Send Photos via WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
