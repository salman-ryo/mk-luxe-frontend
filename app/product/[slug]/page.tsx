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

    const primaryMedia = product.media?.find((m) => m.is_primary) || product.media?.[0]
    const imageUrl = primaryMedia?.url
    const description = product.meta_description || product.description || undefined
    const title = product.meta_title || product.name

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
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