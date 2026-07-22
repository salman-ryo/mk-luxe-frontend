import { getApiUrl } from "@/lib/config";
import type { Product, PaginatedResponse } from "@/types/api";

/** Revalidate every 5 minutes — stock/availability can change */
const PRODUCTS_REVALIDATE_SECONDS = 300;

export async function getBestSellers(): Promise<Product[]> {
  const url = new URL(getApiUrl("products"));
  url.searchParams.set("is_most_sold", "true");
  url.searchParams.set("limit", "5");

  const res = await fetch(url.toString(), {
    next: {
      revalidate: PRODUCTS_REVALIDATE_SECONDS,
      tags: ["products", "best-sellers"],
    },
  });

  if (!res.ok) {
    throw new Error(
      `[ProductService] GET /api/v1/products (best sellers) failed — HTTP ${res.status} ${res.statusText}`
    );
  }

  const responseData: PaginatedResponse<Product> = await res.json();
  const data = responseData.data || [];

  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const url = new URL(getApiUrl("products"));
  url.searchParams.set("is_featured", "true");
  url.searchParams.set("limit", "8");

  const res = await fetch(url.toString(), {
    next: {
      revalidate: PRODUCTS_REVALIDATE_SECONDS,
      tags: ["products", "featured"],
    },
  });

  if (!res.ok) {
    throw new Error(
      `[ProductService] GET /api/v1/products (featured) failed — HTTP ${res.status} ${res.statusText}`
    );
  }

  const responseData: PaginatedResponse<Product> = await res.json();
  const data = responseData.data || [];

  return data;
}