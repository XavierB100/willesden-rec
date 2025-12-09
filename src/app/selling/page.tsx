import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

export default function SellingPage() {
    return (
        <div className="min-h-screen bg-vintage-cream py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-charcoal">
                        Sell to Us
                    </h1>
                    <p className="text-lg text-vintage-charcoal/70 font-sans max-w-2xl mx-auto">
                        We are always looking to buy high-quality reclaimed items.
                        If you have architectural salvage you'd like to sell, we'd love to see it.
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 border border-vintage-charcoal/10 shadow-sm space-y-8 rounded-sm">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-vintage-moss">What We Buy</h2>
                        <ul className="grid md:grid-cols-2 gap-4 font-sans text-vintage-charcoal/80">
                            <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-vintage-gold flex-shrink-0" /> Victorian Fireplaces</li>
                            <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-vintage-gold flex-shrink-0" /> Cast Iron Radiators</li>
                            <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-vintage-gold flex-shrink-0" /> Old Pine Doors</li>
                            <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-vintage-gold flex-shrink-0" /> Stained Glass</li>
                            <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-vintage-gold flex-shrink-0" /> Garden Ornaments</li>
                            <li className="flex items-start"><ArrowRight className="w-5 h-5 mr-2 text-vintage-gold flex-shrink-0" /> Architectural Stone</li>
                        </ul>
                    </div>

                    <div className="space-y-6 border-t border-vintage-charcoal/10 pt-8">
                        <h2 className="text-2xl font-serif font-bold text-vintage-moss">How to Sell</h2>
                        <p className="font-sans text-vintage-charcoal/80">
                            The easiest way to get a quote is to send us photos of your items via WhatsApp.
                            Please include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 font-sans text-vintage-charcoal/80 pl-4">
                            <li>Clear photos of the item</li>
                            <li>Any dimensions or measurements</li>
                            <li>Your location (for collection)</li>
                            <li>Rough price expectation</li>
                        </ul>

                        <div className="pt-4">
                            <a
                                href="https://wa.me/447907020909?text=Hi,%20I%20have%20some%20items%20to%20sell."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                            >
                                <Button size="lg" className="bg-forest-green hover:bg-vintage-moss text-white">
                                    <Phone className="w-5 h-5 mr-2" />
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
