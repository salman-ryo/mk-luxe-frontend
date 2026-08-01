import type { Metadata } from "next"
import ProductScreen from "@/components/pages/product/ProductScreen"
import { getProductBySlug } from "@/lib/services/actions/products"

type PageProps = {
  params: { slug: string } | Promise<{ slug: string }>
}

async function resolveParams(params: PageProps["params"]) {
  return Promise.resolve(params)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await resolveParams(params)

  try {
    const product = await getProductBySlug(slug)

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested luxury jewelry piece could not be found.",
      }
    }

    const primaryMedia = product.media?.find((m) => m.is_primary) || product.media?.[0]
    const imageUrl = primaryMedia?.url
    const description = product.meta_description || product.description || `Discover ${product.name} at MK Luxe Divine.`
    const title = product.meta_title || product.name
    const canonicalUrl = `https://mk-luxe-divine.in/product/${slug}`

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${title} | MK Luxe Divine`,
        description,
        url: canonicalUrl,
        type: "article",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                alt: primaryMedia?.alt || title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | MK Luxe Divine`,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    }
  } catch {
    return {
      title: "Luxury Jewelry Piece",
      description: "Fine luxury jewelry piece from MK Luxe Divine.",
    }
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await resolveParams(params)
  let product = null

  try {
    product = await getProductBySlug(slug)
  } catch {
    // Handled in ProductScreen
  }

  const primaryVariant = product?.variants?.[0]
  const images = product?.media?.map((m) => m.url) || []

  const productJsonLd = product
    ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": images.length > 0 ? images : undefined,
        "description": product.description || product.meta_description || undefined,
        "sku": primaryVariant?.sku || product.id,
        "brand": {
          "@type": "Brand",
          "name": "MK Luxe Divine",
        },
        "offers": {
          "@type": "Offer",
          "url": `https://mk-luxe-divine.in/product/${product.slug}`,
          "priceCurrency": "INR",
          "price": primaryVariant?.price || 0,
          "itemCondition": "https://schema.org/NewCondition",
          "availability":
            (primaryVariant?.stock ?? 1) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      }
    : null

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductScreen slug={slug} />
    </>
  )
}