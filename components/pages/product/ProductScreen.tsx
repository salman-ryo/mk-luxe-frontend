import { notFound } from "next/navigation"
import ProductDetailsClient from "./ProductDetailsClient"
import { getProductBySlug } from "@/lib/services/actions/products"
import type { Product } from "@/types/api"

type SearchParams = Record<string, string | string[] | undefined>

export default async function ProductScreen({
  slug,
}: {
  slug: string
}) {
  let product: Product | null = null

  try {
    product = await getProductBySlug(slug)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong while loading the product."
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Could not load product</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return <ProductDetailsClient product={product} />
}