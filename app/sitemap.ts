import type { MetadataRoute } from "next"
import { getApiUrl } from "@/lib/config"
import type { Product, PaginatedResponse } from "@/types/api"

/**
 * Returns a valid Date for sitemap lastModified.
 * Falls back to the current date if the supplied value is:
 * - null or undefined
 * - invalid
 * - Go's zero time (0001-01-01...)
 * - Unix epoch (1970-01-01...)
 */
function toValidDate(dateInput?: string | Date | null): Date {
  const now = new Date()

  if (!dateInput) {
    return now
  }

  const parsed = new Date(dateInput)

  if (Number.isNaN(parsed.getTime())) {
    return now
  }

  const year = parsed.getUTCFullYear()

  // Reject obviously invalid/default dates
  if (year <= 1970) {
    return now
  }

  return parsed
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mk-luxe-divine.in"
  const currentDate = new Date()

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
      const products = responseData.data ?? []

      productRoutes = products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: toValidDate(
          product.updated_at ?? product.created_at
        ),
        changeFrequency: "monthly",
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error("Failed to generate sitemap product routes:", error)
  }

  return [...staticRoutes, ...productRoutes]
}