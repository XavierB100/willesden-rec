import type { Product, ProductCategory, ProductStatus } from "@/lib/catalogue";

export interface ProductFormState {
  id?: string;
  title: string;
  slug: string;
  price: string;
  category: ProductCategory;
  description: string;
  dimensions: string;
  status: ProductStatus;
  imageUrls: string[];
}

export const emptyProductForm: ProductFormState = {
  title: "",
  slug: "",
  price: "",
  category: "Fireplaces",
  description: "",
  dimensions: "",
  status: "available",
  imageUrls: [],
};

export function productToForm(product: Product): ProductFormState {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price === null ? "" : String(product.price),
    category: product.category,
    description: product.description,
    dimensions: product.dimensions || "",
    status: product.status,
    imageUrls: product.imageUrls,
  };
}
