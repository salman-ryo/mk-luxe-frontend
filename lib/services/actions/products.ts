import "server-only"
import { cache } from "react"
import { getApiUrl } from "@/lib/config"
import type { Product, ApiResponse } from "@/types/api"

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const safeSlug = encodeURIComponent(slug)
  const url = getApiUrl(`products/${safeSlug}`)

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

  const responseData = data as ApiResponse<Product>
  return responseData.data || null
})