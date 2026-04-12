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
        title: "Product not found",
      }
    }

    return {
      title: product.seo_title || product.name,
      description: product.seo_description || product.short_description || product.description || undefined,
      openGraph: {
        title: product.seo_title || product.name,
        description: product.seo_description || product.short_description || product.description || undefined,
        images: product.cover_image_url ? [product.cover_image_url] : undefined,
      },
    }
  } catch {
    return {
      title: "Product",
    }
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await resolveParams(params)
  return <ProductScreen slug={slug} />
}