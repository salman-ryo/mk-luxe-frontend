import { serverEnv } from "@/core/env.server";
import type { Product, ProductsResponse } from "@/types/api";

/** Revalidate every 5 minutes — stock/availability can change */
const PRODUCTS_REVALIDATE_SECONDS = 300;

export async function getBestSellers(): Promise<Product[]> {
  const url = new URL(`${serverEnv.BACKEND_URI}/api/v1/products/`);
  url.searchParams.set("featured", "true");
  url.searchParams.set("best_seller", "true");

  const res = await fetch(url.toString(), {
    next: {
      revalidate: PRODUCTS_REVALIDATE_SECONDS,
      tags: ["products", "best-sellers"],
    },
  });

  if (!res.ok) {
    throw new Error(
      `[ProductService] GET /api/v1/products/ (best sellers) failed — HTTP ${res.status} ${res.statusText}`
    );
  }

  const data: ProductsResponse = await res.json();

  return data.results.filter((p) => p.is_available_online);
}