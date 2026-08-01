import type { MetadataRoute } from "next"
import { getApiUrl } from "@/lib/config"
import type { Product, PaginatedResponse } from "@/types/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mk-luxe-divine.in"

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  let productRoutes: MetadataRoute.Sitemap = []

  try {
    const url = new URL(getApiUrl("products"))
    url.searchParams.set("limit", "100")
    url.searchParams.set("status", "published")

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })

    if (res.ok) {
      const responseData: PaginatedResponse<Product> = await res.json()
      const products = responseData.data || []

      productRoutes = products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }))
    }
  } catch {
    // Graceful fallback if backend is unreachable during static generation
  }

  return [...staticRoutes, ...productRoutes]
}
