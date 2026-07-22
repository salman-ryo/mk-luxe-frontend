"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

type SortValue = "newest" | "oldest" | "price_asc" | "price_desc" | "rating" | "popular" | "stock"

type Filters = {
  q: string
  category: string
  minPrice: string
  maxPrice: string
  material: string
  color: string
  size: string
  sort: SortValue
}

const DEFAULT_FILTERS: Filters = {
  q: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  material: "",
  color: "",
  size: "",
  sort: "newest",
}

function readFiltersFromSearchParams(searchParams: ReturnType<typeof useSearchParams>): Filters {
  const sort = searchParams.get("sort")
  const allowedSorts: SortValue[] = ["newest", "oldest", "price_asc", "price_desc", "rating", "popular", "stock"]

  return {
    q: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    material: searchParams.get("material") ?? "",
    color: searchParams.get("color") ?? "",
    size: searchParams.get("size") ?? "",
    sort: allowedSorts.includes(sort as SortValue) ? (sort as SortValue) : "newest",
  }
}

export default function ShopFilters({ initialFilters }: { initialFilters: Filters }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const key = useMemo(() => searchParams.toString(), [searchParams])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams(searchParams.toString())

    params.delete("q")
    params.delete("category")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("material")
    params.delete("color")
    params.delete("size")
    params.delete("sort")
    params.delete("page")

    const setIfValue = (name: string) => {
      const value = String(formData.get(name) ?? "").trim()
      if (value) params.set(name, value)
    }

    setIfValue("q")
    setIfValue("category")
    setIfValue("minPrice")
    setIfValue("maxPrice")
    setIfValue("material")
    setIfValue("color")
    setIfValue("size")

    const sort = String(formData.get("sort") ?? "newest").trim() as SortValue
    params.set("sort", sort || "newest")
    params.set("page", "1")

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const handleReset = () => {
    router.push(pathname, { scroll: false })
  }

  return (
    <form key={key} onSubmit={handleSubmit} className="space-y-8 sticky top-6">
      <div>
        <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
          <h2 className="uppercase text-xs tracking-widest font-bold">Search</h2>
        </div>
        <input
          name="q"
          type="text"
          placeholder="Search products"
          defaultValue={initialFilters.q}
          className="w-full bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
          <h2 className="uppercase text-xs tracking-widest font-bold">Price Range</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="minPrice"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            defaultValue={initialFilters.minPrice}
            className="w-full bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
          />
          <input
            name="maxPrice"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            defaultValue={initialFilters.maxPrice}
            className="w-full bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3 border-b border-border pb-2">
          <h2 className="uppercase text-xs tracking-widest font-bold">Category</h2>
        </div>
        <select
          name="category"
          defaultValue={initialFilters.category}
          className="w-full bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary text-foreground cursor-pointer"
        >
          <option value="" className="bg-[#0a0a0c]">All Categories</option>
          <option value="earrings" className="bg-[#0a0a0c]">Earrings</option>
          <option value="necklaces" className="bg-[#0a0a0c]">Necklaces</option>
          <option value="jewelry-sets" className="bg-[#0a0a0c]">Jewelry Sets</option>
          <option value="rings" className="bg-[#0a0a0c]">Rings</option>
          <option value="bracelets-bangles" className="bg-[#0a0a0c]">Bracelets & Bangles</option>
          <option value="anklets" className="bg-[#0a0a0c]">Anklets</option>
          <option value="nose-pins" className="bg-[#0a0a0c]">Nose Pins</option>
          <option value="hair-accessories" className="bg-[#0a0a0c]">Hair Accessories</option>
          <option value="bridal-jewelry" className="bg-[#0a0a0c]">Bridal Jewelry</option>
          <option value="traditional-jewelry" className="bg-[#0a0a0c]">Traditional Jewelry</option>
          <option value="men-s-jewelry" className="bg-[#0a0a0c]">Men's Jewelry</option>
          <option value="pendants" className="bg-[#0a0a0c]">Pendants</option>
          <option value="mangalsutra" className="bg-[#0a0a0c]">Mangalsutra</option>
          <option value="brooches" className="bg-[#0a0a0c]">Brooches</option>
          <option value="toe-rings" className="bg-[#0a0a0c]">Toe Rings</option>
          <option value="waist-chains" className="bg-[#0a0a0c]">Waist Chains</option>
          <option value="body-jewelry" className="bg-[#0a0a0c]">Body Jewelry</option>
          <option value="charms" className="bg-[#0a0a0c]">Charms</option>
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3 border-b border-border pb-2">
          <h2 className="uppercase text-xs tracking-widest font-bold">Material</h2>
        </div>
        <input
          name="material"
          type="text"
          placeholder="gold"
          defaultValue={initialFilters.material}
          className="w-full bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3 border-b border-border pb-2">
          <h2 className="uppercase text-xs tracking-widest font-bold">Color</h2>
        </div>
        <input
          name="color"
          type="text"
          placeholder="rose"
          defaultValue={initialFilters.color}
          className="w-full bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3 border-b border-border pb-2">
          <h2 className="uppercase text-xs tracking-widest font-bold">Size</h2>
        </div>
        <input
          name="size"
          type="text"
          placeholder="7"
          defaultValue={initialFilters.size}
          className="w-full bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3 border-b border-border pb-2">
          <h2 className="uppercase text-xs tracking-widest font-bold">Sort</h2>
        </div>
        <select
          name="sort"
          defaultValue={initialFilters.sort}
          className="w-full bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Sort by: Rating</option>
          <option value="popular">Sort by: Popular</option>
          <option value="stock">Sort by: Stock</option>
        </select>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="champagneGold" className="flex-1">
          Apply Filters
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  )
}