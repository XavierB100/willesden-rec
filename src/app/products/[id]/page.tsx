import { products } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MessageCircle, Ruler, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    // WhatsApp Message Construction
    const phoneNumber = "447907020909"; // UK format without +
    const message = encodeURIComponent(
        `Hi, I'm interested in the ${product.title} (ID: ${product.id}). Is this still available?`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center text-vintage-charcoal/60 hover:text-forest-green transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Browse
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Image Column */}
                    <div className="relative aspect-[3/4] bg-white rounded-sm overflow-hidden border border-vintage-charcoal/5 shadow-sm">
                        {product.status === 'sold' && (
                            <div className="absolute top-6 right-6 z-10 bg-vintage-charcoal text-vintage-cream text-sm font-bold px-4 py-2 uppercase tracking-widest shadow-md">
                                Sold Out
                            </div>
                        )}
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Details Column */}
                    <div className="flex flex-col space-y-8 py-4">
                        <div className="space-y-4">
                            <span className="inline-block text-forest-green text-sm font-bold uppercase tracking-wider">
                                {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-charcoal leading-tight">
                                {product.title}
                            </h1>
                            <p className="text-3xl font-serif text-vintage-gold font-semibold">
                                £{product.price}
                            </p>
                        </div>

                        <div className="space-y-6 border-t border-vintage-charcoal/10 pt-8">
                            <div className="flex items-start space-x-3 text-vintage-charcoal/80">
                                <Tag className="w-5 h-5 mt-1 text-forest-green" />
                                <p className="font-sans leading-relaxed">{product.description}</p>
                            </div>

                            {product.dimensions && (
                                <div className="flex items-center space-x-3 text-vintage-charcoal/80">
                                    <Ruler className="w-5 h-5 text-forest-green" />
                                    <p className="font-sans font-medium">Dimensions: {product.dimensions}</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-8 mt-auto">
                            {product.status === 'available' ? (
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="w-full md:w-auto h-16 text-lg space-x-3 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                                        <MessageCircle className="w-6 h-6" />
                                        <span>Enquire / Buy Now</span>
                                    </Button>
                                    <p className="mt-3 text-xs text-vintage-charcoal/50 text-center md:text-left">
                                        Opens WhatsApp directly with the owner
                                    </p>
                                </a>
                            ) : (
                                <Button size="lg" disabled className="w-full md:w-auto h-14 bg-vintage-charcoal/20 text-vintage-charcoal/50 cursor-not-allowed">
                                    Item Sold
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
