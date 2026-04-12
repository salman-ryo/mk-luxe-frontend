import "server-only"
import { cache } from "react"

export type ProductCategory = {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  is_active?: boolean
  sort_order?: number
}

export type ProductImage = {
  id: number
  image_url: string
  alt_text?: string
  is_primary?: boolean
  sort_order?: number
  variant?: unknown
}

export type ProductVariant = {
  id: number
  name: string
  sku?: string
  barcode?: string
  material?: string
  color?: string
  size?: string
  length_mm?: number | null
  width_mm?: number | null
  weight_grams?: number | null
  price?: number | null
  compare_at_price?: number | null
  stock_quantity?: number
  reserved_quantity?: number
  available_stock?: number
  low_stock_threshold?: number
  is_low_stock?: boolean
  is_active?: boolean
  is_default?: boolean
  attributes?: Record<string, string | number | boolean | null>
}

export type ProductFaq = {
  id: number
  question: string
  answer: string
  sort_order?: number
  is_active?: boolean
}

export type ProductReview = Record<string, unknown>

export type Product = {
  id: number
  name: string
  slug: string
  status?: string
  primary_category?: ProductCategory | null
  categories?: ProductCategory[]
  short_description?: string
  description?: string
  care_instructions?: string
  what_you_get?: string[]
  anti_tarnish?: boolean
  water_resistant?: boolean
  sweat_resistant?: boolean
  hypoallergenic?: boolean
  nickel_free?: boolean
  lightweight?: boolean
  material?: string
  base_metal?: string
  plating?: string
  finish?: string
  gemstone?: string
  color_family?: string
  specifications?: Record<string, string | number | boolean | null>
  seo_title?: string
  seo_description?: string
  price_from?: number | null
  price_to?: number | null
  price_display?: string | null
  currency?: string
  warranty_months?: number | null
  return_window_days?: number | null
  delivery_note?: string
  is_available_online?: boolean
  is_available_at_stall?: boolean
  stall_note?: string
  cover_image_url?: string
  alt_text?: string
  weight_grams?: number | null
  length_mm?: number | null
  width_mm?: number | null
  avg_rating?: number | null
  review_count?: number
  variants?: ProductVariant[]
  images?: ProductImage[]
  faqs?: ProductFaq[]
  reviews?: ProductReview[]
  created_at?: string
  updated_at?: string
}

function getBackendBaseUrl() {
  const baseUrl = process.env.BACKEND_URI
  if (!baseUrl) {
    throw new Error("Missing BACKEND_URI environment variable")
  }
  return baseUrl.replace(/\/$/, "")
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const safeSlug = encodeURIComponent(slug)
  const url = `${getBackendBaseUrl()}/api/v1/products/${safeSlug}/`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  })

  if (response.status === 404) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Failed to load product (${response.status})`
    throw new Error(message)
  }

  return data as Product
})