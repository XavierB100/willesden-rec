import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "./catalogue";
import photos from "./review-stock-photos.json";

const titles: Record<ProductCategory, string[]> = {
  Fireplaces: ["Decorative mantel and hearth", "Period fireplace surround", "Traditional timber fire surround", "Rustic brick fireplace"],
  Doors: ["Weathered timber entrance door", "Blue six-panel wooden door", "Green painted period door", "Reclaimed door with original ironwork"],
  Windows: ["Red painted window frame", "Traditional timber casement", "Opening wooden window", "Leaded window in stone surround"],
  Lighting: ["Vintage reading lamp", "Adjustable metal desk lamp", "Traditional table lamp", "Green glass oil lamp"],
  Garden: ["Carved stone garden urn", "Classical garden planter", "Decorative stone flower urn", "Stone balustrade and planted urn"],
  Furniture: ["Traditional wooden chair", "Period dining chair", "Floral upholstered armchair", "Simple timber occasional chair"],
  Other: ["Vintage copper vessels", "Decorative metal frames", "Brass lion-head door knocker", "Vintage toggle light switches"],
};

// Deliberately repeated sample listings provide full pages in every category.
// Alternate gallery images are crops of the same source, not other products.
export const REVIEW_PRODUCTS: Product[] = Array.from({ length: 36 }, (_, index) =>
  PRODUCT_CATEGORIES.map((category, categoryIndex): Product => {
    const photoIndex = index % 4;
    const photo = photos.filter((image) => image.category === category)[photoIndex];
    const slug = `review-sample-${category.toLowerCase()}-${index + 1}`;
    const landscapeFirst = index % 4 === 3;
    const imageUrls = [landscapeFirst ? photo.landscape : photo.portrait];
    if (index % 3 === 0) imageUrls.push(landscapeFirst ? photo.portrait : photo.landscape);
    // Keep one empty-photo example to review the square placeholder as well.
    if (index === 35) imageUrls.length = 0;
    return {
      id: slug,
      slug,
      title: `${titles[category][photoIndex]} ${String(index + 1).padStart(2, "0")}`,
      description: "Fictional sample listing for layout review only. This is not Willesden Reclamation stock and cannot be purchased. Gallery images show alternate portrait and landscape crops of a stock photograph.",
      category,
      price: index % 7 === 0 ? null : 45 + index * 15 + categoryIndex * 25,
      status: index % 11 === 10 ? "sold" : "available",
      imageUrls,
      sample: true,
      createdAt: new Date(Date.UTC(2026, 9, 23) - (index * 7 + categoryIndex) * 60000).toISOString(),
    };
  }),
).flat();

export function reviewPhotoCredit(product: Product) {
  return photos.find((photo) => product.imageUrls.some((url) => url === photo.portrait || url === photo.landscape));
}
