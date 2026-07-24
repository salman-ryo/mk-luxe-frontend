"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  BadgeCheck,
  ChevronRight,
  Droplets,
  Heart,
  Info,
  Minus,
  Plus,
  Ruler,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  MessageCircle,
  Send,
  X,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import type { Product, ProductVariant } from "@/types/api"
import { clientEnv } from "@/core/env.client"

type WhatsAppIntent = "buy" | "enquire"

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPrice(product: Product, variant?: ProductVariant | null) {
  if (variant?.price != null) return formatINR(variant.price)

  const prices = product.variants?.map((v) => v.price).filter((p) => p !== undefined && p !== null) || []
  if (!prices.length) return "Price on request"
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  if (minPrice === maxPrice) {
    return formatINR(minPrice)
  }
  return `${formatINR(minPrice)} – ${formatINR(maxPrice)}`
}

function buildBadges(product: Product) {
  const badges: string[] = []

  if (product.is_featured) badges.push("Featured")
  if (product.is_most_sold) badges.push("Bestseller")
  if (product.status) badges.push(product.status.charAt(0).toUpperCase() + product.status.slice(1))

  return badges
}

function buildSpecItems(product: Product) {
  const items: Array<{ label: string; value: string }> = []

  if (product.category_slug) {
    items.push({ label: "Category", value: product.category_slug.toUpperCase() })
  }

  return items
}

function getPrimaryImage(product: Product) {
  if (product.media?.length) {
    const primary = product.media.find((img) => img.is_primary)
    if (primary?.url) return primary.url
    const first = product.media[0]
    if (first?.url) return first.url
  }
  return "/placeholder.svg"
}

function buildWhatsAppMessage(params: {
  intent: WhatsAppIntent
  product: Product
  quantity: number
  selectedVariant?: ProductVariant | null
  customerName: string
  customerPhone: string
  customerMessage: string
  pageUrl: string
}) {
  const {
    intent,
    product,
    quantity,
    selectedVariant,
    customerName,
    customerPhone,
    customerMessage,
    pageUrl,
  } = params

  const lines = [
    intent === "buy" ? "Hi, I want to buy this product." : "Hi, I want to enquire about this product.",
    "",
    `Product: ${product.name}`,
    `Slug: ${product.slug}`,
    `Category: ${product.category_slug || "Product"}`,
    `Quantity: ${quantity}`,
    `Price: ${formatPrice(product, selectedVariant)}`,
  ]

  if (selectedVariant) {
    lines.push(
      `Variant: ${selectedVariant.name}`,
      `Variant SKU: ${selectedVariant.sku || "—"}`
    )
  }

  if (customerName.trim()) lines.push(`Customer Name: ${customerName.trim()}`)
  if (customerPhone.trim()) lines.push(`Customer Phone: ${customerPhone.trim()}`)
  if (customerMessage.trim()) {
    lines.push("", "Note:", customerMessage.trim())
  }

  lines.push("", `Product Link: ${pageUrl}`)

  return lines.join("\n")
}

function getWhatsappNumber() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
  const digits = raw.replace(/\D/g, "")
  return digits
}

export default function ProductDetailsClient({ product }: { product: Product }) {
  const images = useMemo(() => {
    const list = product.media?.map((m, i) => ({
      id: String(i),
      image_url: m.url,
      alt_text: m.alt || product.name,
    })) ?? []

    if (list.length > 0) return list

    return [
      {
        id: "0",
        image_url: getPrimaryImage(product),
        alt_text: product.name,
      },
    ]
  }, [product])

  const variants = product.variants ?? []
  const defaultVariant = variants[0] ?? null

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantSku, setSelectedVariantSku] = useState<string | null>(defaultVariant?.sku ?? null)
  const [wishlisted, setWishlisted] = useState(false)

  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [whatsappIntent, setWhatsappIntent] = useState<WhatsAppIntent>("enquire")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerMessage, setCustomerMessage] = useState("")

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.sku === selectedVariantSku) ?? defaultVariant,
    [defaultVariant, selectedVariantSku, variants],
  )

  const displayPrice = formatPrice(product, selectedVariant)
  const rating = 5
  const reviewCount = 0

  const availableStock = selectedVariant?.stock ?? 0
  const inStock = availableStock > 0
  const lowStock = availableStock <= 3

  const categoryName = product.category_slug || "Product"
  const badges = buildBadges(product)
  const specItems = buildSpecItems(product)

  const openWhatsApp = (intent: WhatsAppIntent) => {
    setWhatsappIntent(intent)
    setIsWhatsAppOpen(true)
  }

  const sendWhatsApp = () => {
    const number = getWhatsappNumber()
    if (!number) {
      alert("WhatsApp number is not configured. Set NEXT_PUBLIC_WHATSAPP_NUMBER in your environment.")
      return
    }

    const pageUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `${clientEnv.FRONTEND_URI}/product/${product.slug}`

    const message = buildWhatsAppMessage({
      intent: whatsappIntent,
      product,
      quantity,
      selectedVariant,
      customerName,
      customerPhone,
      customerMessage,
      pageUrl,
    })

    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    setIsWhatsAppOpen(false)
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-8 lg:py-10 lg:px-16 bg-midnight-charcoal max-md:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{product.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category_slug || "")}`}>
            {categoryName}
          </Link>
          <span>/</span>
          <span className="text-primary">{product.slug}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="relative h-[300px] sm:h-[400px] lg:h-[400px] w-full overflow-hidden rounded-2xl border border-border bg-card/40 flex items-center justify-center p-6 shadow-sm">
            <img
              src={images[selectedImage]?.image_url || getPrimaryImage(product)}
              alt={images[selectedImage]?.alt_text || product.name}
              className="max-h-full max-w-full object-contain"
            />

            <button
              type="button"
              onClick={() => setWishlisted((prev) => !prev)}
              className="absolute right-4 top-4 rounded-full border border-border bg-background/70 p-3 backdrop-blur-md transition hover:scale-105"
              aria-label="Add to wishlist"
            >
              <Heart className={`h-5 w-5 ${wishlisted ? "fill-current text-primary" : "text-foreground"}`} />
            </button>

            <div className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground shadow-sm backdrop-blur-md">
              {categoryName}
            </div>

            {product.status ? (
              <div className="absolute bottom-4 left-4 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur-md">
                {product.status}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <button
                key={`${img.id}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-xl border bg-card transition ${selectedImage === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border opacity-70 hover:opacity-100"
                  }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text || `${product.name} view ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:max-h-[500px] lg:overflow-y-auto pr-3 scrollbar-thin">
          <div className="mb-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
              >
                {badge}
              </span>
            ))}
            {product.is_featured ? (
              <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Featured
              </span>
            ) : null}
            {product.is_most_sold ? (
              <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Most Sold
              </span>
            ) : null}
          </div>

          <p className="mb-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {product.description || (product as any).short_description}
          </p>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(rating) ? "fill-current" : "fill-current opacity-40"}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{rating ? rating.toFixed(1) : "New"}</span>
            <span className="text-sm text-muted-foreground">
              {reviewCount > 0 ? `(${reviewCount} reviews)` : "(No reviews yet)"}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className={`text-sm font-medium ${inStock ? "text-emerald-600" : "text-red-500"}`}>
              {inStock ? (lowStock ? `Only ${availableStock} left` : "In stock") : "Out of stock"}
            </span>
          </div>

          <div className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-end gap-3">
              <div className="text-3xl font-semibold tracking-tight">{displayPrice}</div>
              <div className="text-sm text-muted-foreground">
                Pricing based on available variants
              </div>
            </div>
          </div>

          <div className="mb-8 space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Variant
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(variants.length > 0 ? variants : [null]).map((variant) => {
                  if (!variant) {
                    return (
                      <div
                        key="default-variant"
                        className="rounded-2xl border border-border bg-card p-4 text-left"
                      >
                        <div className="text-sm font-semibold">{product.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Default product listing
                        </div>
                      </div>
                    )
                  }

                  const active = variant.sku === selectedVariantSku
                  const stock = variant.stock ?? 0

                  return (
                    <button
                      key={variant.sku}
                      type="button"
                      onClick={() => setSelectedVariantSku(variant.sku)}
                      className={`rounded-2xl border p-4 text-left transition ${active
                          ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                          : "border-border bg-card hover:border-primary/40"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{variant.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Single variant
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {variant.price != null ? formatINR(variant.price) : "—"}
                          </div>
                          <div className="text-xs text-muted-foreground">SKU {variant.sku || "—"}</div>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        {stock > 0 ? `${stock} available` : "Sold out"}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                Quantity
              </div>
              <div className="inline-flex items-center overflow-hidden rounded-xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-3 transition hover:bg-muted"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-14 px-6 py-3 text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-3 transition hover:bg-muted"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <Button
              className="rounded-2xl px-6 py-4 text-sm font-semibold"
              variant="outline"
              onClick={() => openWhatsApp("enquire")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Enquire on WhatsApp
            </Button>

            <Button
              className="rounded-2xl px-6 py-4 text-sm font-semibold"
              variant="champagneGold"
              disabled={!inStock}
              onClick={() => openWhatsApp("buy")}
            >
              <Send className="mr-2 h-4 w-4" />
              {inStock ? "Buy on WhatsApp" : "Notify Me on WhatsApp"}
            </Button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" /> Secure checkout
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <RotateCcw className="h-5 w-5 text-primary" />
              Return support available
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              Fast dispatch after order confirmation
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Droplets className="h-5 w-5 text-primary" /> Easy maintenance
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 grid gap-8 border-t border-border pt-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Product details</h2>
          <p className="mb-6 max-w-3xl leading-7 text-muted-foreground">
            {product.description || "No description available."}
          </p>

          {false ? null : null}

          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Highlights
              </h3>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {badges.length ? (
                  badges.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Elegant everyday styling</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Materials
              </h3>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                {specItems.length ? (
                  specItems.map((item) => (
                    <li key={`${item.label}-${item.value}`} className="flex gap-3">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        <span className="font-medium text-foreground">{item.label}:</span> {item.value}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="flex gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Details available in the product data</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Care instructions
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">
              Handle with care and store in a dry pouch after use.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Product info
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0">Category</span>
                <span className="text-right text-foreground">{categoryName}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0">Status</span>
                <span className="text-right text-foreground uppercase">{product.status || "—"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Shipping & support
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-primary" />
                <span>Delivery details will be shown at checkout.</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span>Return policy shown at checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Secure packaging and payment support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-16">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">More information</h2>
        <Accordion type="single" collapsible className="w-full rounded-2xl border border-border bg-card px-5">
          <AccordionItem value="specifications" className="border-border">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              Specifications
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-7 text-muted-foreground">
              {specItems.length ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {specItems.map((item) => (
                    <div key={`${item.label}-${item.value}`} className="rounded-xl bg-muted/40 px-4 py-3">
                      <span className="font-medium text-foreground">{item.label}:</span> {item.value}
                    </div>
                  ))}
                </div>
              ) : (
                "No additional specifications available."
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq" className="border-border">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              FAQ
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-7 text-muted-foreground">
              {product.faqs?.length ? (
                <div className="space-y-4">
                  {product.faqs.map((faq, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-background p-4">
                      <div className="mb-1 text-sm font-semibold text-foreground">{faq.question}</div>
                      <p>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                "FAQ content is not available for this product yet."
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notes" className="border-border">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              Notes
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-7 text-muted-foreground">
              This page is fully driven by the product API response, so the same component will work for any slug
              without hard-coded content.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="mt-16 border-t border-border pt-16">
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Looking for more earrings?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Browse the category and continue shopping from the same collection.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Button asChild variant="champagneGold">
              <Link href={`/shop?category=${encodeURIComponent(product.category_slug || "")}`}>
                Explore category <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-6 text-xs text-muted-foreground">Product ID: {product.id}</div>

      <div className="sticky bottom-4 z-20 mt-12 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur md:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedVariant?.name || product.name || "Product"}
          </span>
          <span className="font-semibold">{displayPrice}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => openWhatsApp("enquire")}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Enquire
          </Button>
          <Button variant="champagneGold" disabled={!inStock} onClick={() => openWhatsApp("buy")}>
            <Send className="mr-2 h-4 w-4" />
            {inStock ? "Buy" : "Notify Me"}
          </Button>
        </div>
      </div>

      {isWhatsAppOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  WhatsApp {whatsappIntent === "buy" ? "Purchase" : "Enquiry"}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                  {whatsappIntent === "buy" ? "Send buy request" : "Send enquiry"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWhatsAppOpen(false)}
                className="rounded-full border border-border p-2 text-muted-foreground transition hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Product
                </div>
                <div className="mt-2 text-sm font-semibold">{product.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{categoryName}</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {selectedVariant?.name ? `Variant: ${selectedVariant.name}` : "Single product listing"}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">Quantity: {quantity}</div>
                <div className="mt-1 text-sm text-muted-foreground">Price: {displayPrice}</div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Your details
                </div>

                <div className="mt-3 space-y-3">
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                  <textarea
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    rows={5}
                    placeholder="Anything specific? : size, color preference, gift note, delivery timing, etc."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setIsWhatsAppOpen(false)}>
                Cancel
              </Button>
              <Button variant="champagneGold" onClick={sendWhatsApp}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Open WhatsApp
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              A WhatsApp chat will open with the product details already filled in.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}