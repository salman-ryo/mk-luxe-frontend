import type { MetadataRoute } from "next"
import { getApiUrl } from "@/lib/config"
import type { Product, PaginatedResponse } from "@/types/api"

/**
 * Safely parses any date value into a valid ISO 8601 string.
 * Prevents 'Invalid Date' errors in Google Search Console if a product's
 * updated_at or created_at timestamp is null, undefined, or malformed.
 */
function toValidIsoDate(dateInput?: string | Date | null): string {
  if (!dateInput) {
    return new Date().toISOString()
  }
  const parsed = new Date(dateInput)
  if (isNaN(parsed.getTime())) {
    return new Date().toISOString()
  }
  return parsed.toISOString()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mk-luxe-divine.in"
  const currentDate = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: currentDate,
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
      next: { revalidate: 86400 },
    })

    if (res.ok) {
      const responseData: PaginatedResponse<Product> = await res.json()
      const products = responseData.data || []

      productRoutes = products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: toValidIsoDate(product.updated_at || product.created_at),
        changeFrequency: "monthly",
        priority: 0.8,
      }))
    }
  } catch {
    // Graceful fallback if backend is unreachable during static generation
  }

  return [...staticRoutes, ...productRoutes]
}
