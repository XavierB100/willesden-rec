import { getStorefrontProducts } from "@/lib/storefront-data";
import { getSiteSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { PRODUCT_CATEGORIES, PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/catalogue";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Recycle,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Willesden Reclamation | Architectural Salvage in London",
  "Browse reclaimed Victorian fireplaces, antique doors, windows, garden pieces, and architectural salvage from Willesden Reclamation in London NW10.",
  "/",
);
export const dynamic = "force-dynamic";

export default async function Home() {
  const [latestProducts, settings] = await Promise.all([
    getStorefrontProducts({ includeSold: false, limit: 10 }),
    getSiteSettings(),
  ]);
  const feature = latestProducts.find((item) => item.imageUrls.length);
  return (
    <>
      <section className="heritage-hero">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Architectural salvage · London NW10</p>
            <h1>
              Old soul.
              <br />
              <em>New beginnings.</em>
            </h1>
            <p className="hero-description">
              Original fireplaces, timeworn doors and one-of-a-kind finds.
              Discover a little of London’s history, ready for its next home.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href="/stock"
                size="lg"
                className="bg-vintage-gold text-vintage-moss hover:bg-white"
              >
                Explore the stock <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink
                href="/contact"
                size="lg"
                variant="outline"
                className="border-vintage-cream/40 text-vintage-cream hover:bg-vintage-cream hover:text-vintage-moss"
              >
                Visit the yard
              </ButtonLink>
            </div>
            <p className="hero-footnote">
              <span /> Reclaimed. Rediscovered. Ready to be loved again.
            </p>
          </div>
          {feature ? (
            <Link
              href={`/products/${feature.slug || feature.id}`}
              className="hero-feature group"
            >
              <div className="hero-photo">
                <Image
                  src={feature.imageUrls[0] || PRODUCT_IMAGE_PLACEHOLDER}
                  alt={feature.title}
                  fill
                  sizes="(min-width: 1024px) 42vw, (min-width: 640px) 70vw, 90vw"
                  loading="eager"
                  fetchPriority="high"
                  className="object-contain"
                />
              </div>
              <div className="hero-caption">
                <div>
                  <span>
                    {feature.sample
                      ? "A glimpse of the collection · Sample"
                      : "Discover the collection"}
                  </span>
                  <h2>{feature.title}</h2>
                </div>
                <ArrowUpRight aria-hidden="true" />
              </div>
            </Link>
          ) : (
            <div className="hero-empty">
              <span className="font-serif text-8xl text-vintage-gold">WR</span>
              <p>
                Objects with a past.
                <br />
                Possibilities for the future.
              </p>
            </div>
          )}
        </div>
      </section>
      <div className="yard-strip">
        <div className="site-container">
          <span>
            <MapPin size={16} /> A proper London reclamation yard
          </span>
          <span>
            <Recycle size={16} /> A second life for original pieces
          </span>
          <Link href="/contact">
            <MessageCircle size={16} /> Talk to the people who know the stock{" "}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <section className="section-space site-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Find your next piece</p>
            <h2>Explore the yard</h2>
          </div>
          <p>
            From the hearth to the garden.
            <br />
            There’s character in every corner.
          </p>
        </div>
        <div className="collection-grid">
          {PRODUCT_CATEGORIES.map((category, index) => (
            <Link
              key={category}
              href={`/stock?category=${category}`}
              className="collection-link"
            >
              <span className="collection-number">0{index + 1}</span>
              <span className="font-serif">{category}</span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
          <Link href="/stock" className="collection-link collection-link-all">
            <span className="font-serif">All stock</span>
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="section-space site-container border-t border-vintage-charcoal/15">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Worth a closer look</p>
            <h2>Latest arrivals</h2>
          </div>
          <Link href="/stock" className="text-link">
            View all stock <ArrowRight size={17} />
          </Link>
        </div>
        {latestProducts.length ? (
          <div className="product-grid latest-arrivals-grid">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>New finds are on their way.</h3>
            <p>Contact the yard for stock that hasn’t made it online yet.</p>
            <ButtonLink href="/contact">Ask about stock</ButtonLink>
          </div>
        )}
      </section>
      <section className="yard-story">
        <div className="site-container story-grid">
          <div>
            <p className="eyebrow">The next chapter starts here</p>
            <h2>
              Some things are
              <br />
              <em>too good to lose.</em>
            </h2>
          </div>
          <div>
            <p>
              Our yard brings together original architectural pieces with the
              patina, detail and craftsmanship that only time can give. Come
              with a project in mind, or simply a little curiosity.
            </p>
            <div className="flex flex-wrap gap-5 mt-6">
              <Link href="/contact" className="text-link">
                Find us in Willesden <ArrowUpRight size={18} />
              </Link>
              <Link href="/selling" className="text-link">
                Have something to sell? <ArrowUpRight size={18} />
              </Link>
            </div>
            <p className="mt-8 text-sm">{settings.addressLines.join(" · ")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
