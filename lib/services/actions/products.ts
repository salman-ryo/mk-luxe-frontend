import "server-only"
import { cache } from "react"
import type { Product, ApiResponse } from "@/types/api"

function getBackendBaseUrl() {
  const baseUrl = process.env.BACKEND_URI
  if (!baseUrl) {
    throw new Error("Missing BACKEND_URI environment variable")
  }
  return baseUrl.replace(/\/$/, "")
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const safeSlug = encodeURIComponent(slug)
  const url = `${getBackendBaseUrl()}/api/v1/products/${safeSlug}`

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