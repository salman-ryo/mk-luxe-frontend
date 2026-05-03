export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  product_count: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  variant: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  primary_category: ProductCategory;
  primary_image: ProductImage | null;
  short_description: string;
  anti_tarnish: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  price_from: string;
  price_to: string | null;
  price_display: string;
  currency: string;
  avg_rating: number;
  review_count: number;
  has_stock: boolean;
  is_available_online: boolean;
}

export type ProductsResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
};