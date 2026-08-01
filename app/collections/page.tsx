import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Curated Fine Jewelry Collections",
  description: "Discover our meticulously crafted series — Celestial Harmony, Heritage Gold, and The Modernist. Each piece tells a story of timeless beauty.",
  alternates: {
    canonical: "https://mk-luxe-divine.in/collections",
  },
  openGraph: {
    title: "Curated Fine Jewelry Collections | MK Luxe Divine",
    description: "Discover our meticulously crafted series — Celestial Harmony, Heritage Gold, and The Modernist.",
    url: "https://mk-luxe-divine.in/collections",
  },
}

const collections = [
  {
    id: "celestial",
    title: "Celestial Harmony",
    description:
      "Inspired by the infinite beauty of the night sky, featuring deep sapphires and brilliant diamonds set in rose gold.",
    image: "/images/collection/dark-moody-luxury-jewelry-necklace.jpg",
    itemCount: 12,
  },
  {
    id: "heritage",
    title: "Heritage Gold",
    description:
      "A tribute to timeless craftsmanship. Bold, architectural pieces that celebrate the rich history of fine metalwork.",
    image: "/images/collection/gold-bangle-bracelet.jpg",
    itemCount: 8,
  },
  {
    id: "modernist",
    title: "The Modernist",
    description:
      "Minimalist silhouettes and avant-garde designs for the contemporary connoisseur who values understated elegance.",
    image: "/images/collection/luxury-ring-pendant-1.jpg",
    itemCount: 15,
  },
]

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-16 md:pt-36 md:pb-24 px-16 max-md:px-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-16 md:mb-24">
          <h1 className="text-xs md:text-sm uppercase tracking-[0.4em] text-champagne-gold mb-6 border-l-2 border-champagne-gold pl-4 font-semibold">
            Curated Collections
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight uppercase mb-6 md:mb-8">
            Exquisite <br />
            <span className="text-champagne-gold italic font-normal">Narratives</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Discover our meticulously crafted series, each telling a unique story of elegance, power, and timeless
            beauty.
          </p>
        </div>

        <div className="space-y-20 md:space-y-32">
          {collections.map((collection, index) => (
            <section
              key={collection.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center"
            >
              <div
                className={`w-full md:col-span-7 relative aspect-[4/5] md:aspect-[16/10] overflow-hidden group ${index % 2 === 1 ? "md:order-2" : "md:order-1"
                  }`}
              >
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              </div>

              <div
                className={`w-full md:col-span-5 flex flex-col justify-center ${index % 2 === 1 ? "md:order-1" : "md:order-2"
                  }`}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-champagne-gold mb-4 font-semibold">
                  {collection.itemCount} Pieces
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif uppercase mb-6 leading-tight text-white">
                  {collection.title}
                </h3>
                <p className="text-muted-foreground mb-8 md:mb-10 text-pretty leading-relaxed text-sm md:text-base">
                  {collection.description}
                </p>
                <Link
                  href={`/shop`}
                  className="group inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold text-white hover:text-champagne-gold transition-colors w-fit"
                >
                  Explore Products
                  <span className="p-2 border border-border group-hover:border-champagne-gold rounded-full transition-colors">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-champagne-gold transition-colors" />
                  </span>
                </Link>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
