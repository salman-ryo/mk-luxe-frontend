import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Filter, LayoutGrid, RefreshCw } from "lucide-react"
import ShopFilters from "./ShopFilters"

type ApiProduct = {
  id?: number | string
  slug?: string
  name?: string

  price_range?: string | null
  price_from?: string | number | null
  price_to?: string | number | null
  currency?: string | null

  // ❗ ADD THIS
  primary_image?: {
    image_url?: string | null
    alt_text?: string | null
    is_primary?: boolean
  }

  // (optional fallback if future APIs change)
  cover_image_url?: string | null
  images?: Array<{
    image_url?: string | null
    alt_text?: string | null
    is_primary?: boolean
  }>

  avg_rating?: number | string | null
  review_count?: number | null
}
type SearchParams = Record<string, string | string[] | undefined>

type Filters = {
  q: string
  category: string
  minPrice: string
  maxPrice: string
  material: string
  color: string
  size: string
  sort: "newest" | "oldest" | "price_asc" | "price_desc" | "rating" | "popular" | "stock"
  page: number
}

const PAGE_SIZE = 12
const SORT_VALUES = ["newest", "oldest", "price_asc", "price_desc", "rating", "popular", "stock"] as const

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

function normalizePage(value: string | string[] | undefined) {
  const raw = Number(firstValue(value))
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1
}

function normalizeFilters(searchParams: SearchParams = {}): Filters {
  const sortCandidate = firstValue(searchParams.sort)
  const sort = SORT_VALUES.includes(sortCandidate as (typeof SORT_VALUES)[number])
    ? (sortCandidate as Filters["sort"])
    : "newest"

  return {
    q: firstValue(searchParams.q),
    category: firstValue(searchParams.category),
    minPrice: firstValue(searchParams.minPrice),
    maxPrice: firstValue(searchParams.maxPrice),
    material: firstValue(searchParams.material),
    color: firstValue(searchParams.color),
    size: firstValue(searchParams.size),
    sort,
    page: normalizePage(searchParams.page),
  }
}

function buildProductsUrl(filters: Filters) {
  const backendUri = process.env.BACKEND_URI
  if (!backendUri) {
    throw new Error("Missing BACKEND_URI environment variable")
  }

  const params = new URLSearchParams()
  params.set("page", String(filters.page))
  params.set("page_size", String(PAGE_SIZE))

  if (filters.q.trim()) params.set("search", filters.q.trim()) // rename if your API expects a different keyword param
  if (filters.category.trim()) params.set("category", filters.category.trim())
  if (filters.minPrice.trim()) params.set("min_price", filters.minPrice.trim())
  if (filters.maxPrice.trim()) params.set("max_price", filters.maxPrice.trim())
  if (filters.material.trim()) params.set("material", filters.material.trim())
  if (filters.color.trim()) params.set("color", filters.color.trim())
  if (filters.size.trim()) params.set("size", filters.size.trim())
  if (filters.sort) params.set("sort", filters.sort)

  return `${backendUri}/api/v1/products/?${params.toString()}`
}

function buildPageHref(filters: Filters, page: number) {
  const params = new URLSearchParams()

  params.set("page", String(page))
  if (filters.q.trim()) params.set("q", filters.q.trim())
  if (filters.category.trim()) params.set("category", filters.category.trim())
  if (filters.minPrice.trim()) params.set("minPrice", filters.minPrice.trim())
  if (filters.maxPrice.trim()) params.set("maxPrice", filters.maxPrice.trim())
  if (filters.material.trim()) params.set("material", filters.material.trim())
  if (filters.color.trim()) params.set("color", filters.color.trim())
  if (filters.size.trim()) params.set("size", filters.size.trim())
  if (filters.sort) params.set("sort", filters.sort)

  const query = params.toString()
  return query ? `/shop?${query}` : "/shop"
}

function formatPrice(product: ApiProduct) {
  if (product.price_range) return product.price_range

  const currency = product.currency || "INR"
  const from = product.price_from
  const to = product.price_to

  if (from != null && to != null && String(from) !== String(to)) {
    return `${currency} ${from} - ${to}`
  }

  if (from != null) return `${currency} ${from}`
  if (to != null) return `${currency} ${to}`

  return "Price on request"
}

function getImageUrl(product: ApiProduct) {
  // ✅ correct source
  if (product.primary_image?.image_url) {
    return product.primary_image.image_url
  }

  // fallback (future-proof)
  if (product.cover_image_url) return product.cover_image_url

  const primaryImage = product.images?.find(
    (image) => image?.is_primary && image.image_url
  )
  if (primaryImage?.image_url) return primaryImage.image_url

  const firstImage = product.images?.find((image) => image?.image_url)
  if (firstImage?.image_url) return firstImage.image_url

  return "/placeholder.svg"
}

function getProductHref(product: ApiProduct) {
  if (product.slug) return `/product/${product.slug}`
  if (product.id != null) return `/product/${product.id}`
  return "/shop"
}

function buildPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages] as const
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages] as const
}

async function getProducts(filters: Filters) {
  try {
    const response = await fetch(buildProductsUrl(filters), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const message = data?.detail || data?.message || `Failed to load products (${response.status})`
      return {
        products: [] as ApiProduct[],
        count: 0,
        error: message as string,
      }
    }

    const results = Array.isArray(data) ? data : data?.results ?? []
    const count = Array.isArray(data) ? results.length : Number(data?.count ?? results.length)

    return {
      products: results as ApiProduct[],
      count,
      error: null as string | null,
    }
  } catch (error) {
    return {
      products: [] as ApiProduct[],
      count: 0,
      error: error instanceof Error ? error.message : "Something went wrong while loading products.",
    }
  }
}

export default async function ShopScreen({ searchParams }: { searchParams?: SearchParams }) {
  const filters = normalizeFilters(searchParams)
  const { products, count, error } = await getProducts(filters)

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const currentPage = Math.min(filters.page, totalPages)
  const pageItems = buildPageItems(currentPage, totalPages)

  const start = count > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0
  const end = count > 0 ? Math.min(currentPage * PAGE_SIZE, count) : 0

  return (
    <div className="container mx-auto py-24 px-16 bg-midnight-charcoal">
      <div className="mb-12">
        <h1 className="text-4xl font-serif uppercase tracking-widest mb-4">Products</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span className="text-primary">Products</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-72">
          <ShopFilters initialFilters={filters} />
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-4 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold bg-card px-4 py-2 border border-border">
                <Filter className="w-3 h-3" />
                Filter
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {count > 0 ? `Showing ${start} to ${end} of ${count} results` : "Showing 0 results"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <LayoutGrid className="w-4 h-4 text-primary inline-block mr-2" />
                Grid
              </div>
            </div>
          </div>

          {error ? (
            <div className="border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-serif uppercase tracking-widest mb-2">Could not load products</h3>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button asChild variant="champagneGold">
                    <Link href="/shop">Try again</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="border border-border bg-card p-6">
              <h3 className="text-sm font-serif uppercase tracking-widest mb-2">No products found</h3>
              <p className="text-sm text-muted-foreground">
                Try changing your filters or sorting options.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                  const image = getImageUrl(product)
                  const href = getProductHref(product)
                  const rating = Number(product.avg_rating || 0)
                  const filledStars = Math.max(0, Math.min(5, Math.round(rating)))

                  return (
                    <Link key={`${product.slug ?? product.id}`} href={href} className="group">
                      <div className="relative aspect-square bg-card border border-border overflow-hidden mb-4">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={product.name || "Product Image"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 rounded-none text-background py-3 text-[10px] uppercase tracking-widest font-bold translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-champagne-gold text-center">
                          Quick View
                        </div>
                      </div>

                      <h3 className="text-sm font-serif uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-primary font-bold text-sm">{formatPrice(product)}</span>
                        <div className="flex text-[8px] text-primary">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span key={index}>{index < filledStars ? "★" : "☆"}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16 flex-wrap">
                  {pageItems.map((item, index) => {
                    if (item === "ellipsis") {
                      return (
                        <span key={`ellipsis-${index}`} className="text-muted-foreground">
                          ...
                        </span>
                      )
                    }

                    const isActive = item === currentPage

                    return (
                      <Link
                        key={item}
                        href={buildPageHref(filters, item)}
                        className={[
                          "w-8 h-8 rounded-full border text-xs flex items-center justify-center transition-colors",
                          isActive
                            ? "border-primary text-primary bg-primary/10"
                            : "border-border hover:border-primary",
                        ].join(" ")}
                      >
                        {item}
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}