import ShopScreen from "@/components/pages/shop/ShopScreen"

type ShopPageProps = {
  searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {})
  return <ShopScreen searchParams={resolvedSearchParams} />
}