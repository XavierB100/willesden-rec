import { getStorefrontProductByIdentifier } from "@/lib/storefront-data";
import { SITE_URL, pageMetadata, jsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProductGallery } from "@/components/products/ProductGallery";
import {
  buildWhatsAppUrl,
  formatPrice,
  getSiteSettings,
} from "@/lib/data";
import { ArrowLeft, MessageCircle, Ruler, Tag } from "lucide-react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getStorefrontProductByIdentifier(id);

  if (!product) {
    return {
      title: "Item Not Found | Willesden Reclamation",
    };
  }

  return pageMetadata(
    `${product.title} | Willesden Reclamation`,
    product.description,
    `/products/${product.slug || product.id}`,
    product.imageUrls[0],
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    getStorefrontProductByIdentifier(id),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  if (id !== (product.slug || product.id))
    permanentRedirect(`/products/${product.slug || product.id}`);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(
    /\/$/,
    "",
  );
  const productUrl = `${siteUrl}/products/${product.slug || product.id}`;
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    `Hi, I'm interested in ${product.title}. Here's the listing: ${productUrl}. Is it still available?`,
  );

  return (
    <div className="min-h-screen bg-vintage-cream py-12 px-4 md:px-8">
      {!product.sample && <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            image: product.imageUrls.length ? product.imageUrls : undefined,
            sku: product.id,
            category: product.category,
            url: `${SITE_URL}/products/${product.slug || product.id}`,
            ...(product.price !== null
              ? {
                  offers: {
                    "@type": "Offer",
                    price: product.price,
                    priceCurrency: "GBP",
                    availability:
                      product.status === "sold"
                        ? "https://schema.org/SoldOut"
                        : "https://schema.org/InStock",
                    itemCondition: "https://schema.org/UsedCondition",
                    url: `${SITE_URL}/products/${product.slug || product.id}`,
                  },
                }
              : {}),
          }),
        }}
      />}
      <div className="max-w-6xl mx-auto space-y-8">
        <Link
          href="/stock"
          className="inline-flex items-center text-vintage-charcoal/80 hover:text-forest-green transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          <ProductGallery
            title={product.title}
            imageUrls={product.imageUrls}
            sold={product.status === "sold"}
          />

          <div className="flex flex-col space-y-8 py-4">
            <div className="space-y-4">
              <span className="inline-block text-forest-green text-sm font-bold uppercase tracking-wider">
                {product.category}{product.sample && " · Sample"}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-charcoal leading-tight">
                {product.title}
              </h1>
              <p className="text-3xl font-serif text-vintage-gold font-semibold">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="space-y-6 border-t border-vintage-charcoal/10 pt-8">
              <div className="flex items-start space-x-3 text-vintage-charcoal/80">
                <Tag className="w-5 h-5 mt-1 text-forest-green flex-shrink-0" />
                <p className="font-sans leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.dimensions && (
                <div className="flex items-center space-x-3 text-vintage-charcoal/80">
                  <Ruler className="w-5 h-5 text-forest-green flex-shrink-0" />
                  <p className="font-sans font-medium">
                    Dimensions: {product.dimensions}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-8 mt-auto">
              {product.sample ? (
                <div className="space-y-3">
                  <p className="font-semibold">Sample listing — unavailable to purchase</p>
                </div>
              ) : product.status === "available" ? (
                <div>
                  <ButtonLink
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                    className="w-full md:w-auto h-16 text-lg space-x-3 bg-[#25D366] hover:bg-[#128C7E] text-vintage-charcoal shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>Enquire on WhatsApp</span>
                  </ButtonLink>
                  <p className="mt-3 text-xs text-vintage-charcoal/80 text-center md:text-left">
                    Opens WhatsApp directly with the owner
                  </p>
                </div>
              ) : (
                <Button
                  size="lg"
                  disabled
                  className="w-full md:w-auto h-14 bg-vintage-charcoal/20 text-vintage-charcoal/80 cursor-not-allowed"
                >
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
