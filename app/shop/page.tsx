import type { Metadata } from "next"
import ShopScreen from "@/components/pages/shop/ShopScreen"

export const metadata: Metadata = {
  title: "Shop Luxury Jewelry Collections",
  description: "Browse our complete catalog of fine gold jewelry, rare gemstone rings, necklaces, and bespoke adornments at MK Luxe Divine.",
  alternates: {
    canonical: "https://mk-luxe-divine.in/shop",
  },
  openGraph: {
    title: "Shop Luxury Jewelry Collections | MK Luxe Divine",
    description: "Browse our complete catalog of fine gold jewelry, rare gemstone rings, necklaces, and bespoke adornments at MK Luxe Divine.",
    url: "https://mk-luxe-divine.in/shop",
  },
}

type ShopPageProps = {
  searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {})
  return <ShopScreen searchParams={resolvedSearchParams} />
}