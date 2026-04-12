import Link from "next/link"
import { ArrowRight } from "lucide-react"

const collections = [
  {
    id: "celestial",
    title: "Celestial Harmony",
    description:
      "Inspired by the infinite beauty of the night sky, featuring deep sapphires and brilliant diamonds set in rose gold.",
    image: "/dark-moody-luxury-jewelry-necklace.jpg",
    itemCount: 12,
  },
  {
    id: "heritage",
    title: "Heritage Gold",
    description:
      "A tribute to timeless craftsmanship. Bold, architectural pieces that celebrate the rich history of fine metalwork.",
    image: "/gold-bangle-bracelet.jpg",
    itemCount: 8,
  },
  {
    id: "modernist",
    title: "The Modernist",
    description:
      "Minimalist silhouettes and avant-garde designs for the contemporary connoisseur who values understated elegance.",
    image: "/silver-watch-minimal.jpg",
    itemCount: 15,
  },
]

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-16">
          <h1 className="text-sm uppercase tracking-[0.4em] text-primary mb-6 border-l-2 border-primary pl-4">
            Curated Collections
          </h1>
          <h2 className="text-5xl md:text-6xl font-serif leading-tight uppercase mb-8">
            Exquisite <br />
            <span className="text-primary italic">Narratives</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Discover our meticulously crafted series, each telling a unique story of elegance, power, and timeless
            beauty.
          </p>
        </div>

        <div className="space-y-32">
          {collections.map((collection, index) => (
            <section
              key={collection.id}
              className={`flex flex-col gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              <div className="w-full md:w-3/5 relative aspect-4/5 md:aspect-video overflow-hidden group">
                <img
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="w-full md:w-2/5 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
                  {collection.itemCount} Pieces
                </span>
                <h3 className="text-4xl font-serif uppercase mb-6 leading-tight">{collection.title}</h3>
                <p className="text-muted-foreground mb-10 text-pretty leading-relaxed">{collection.description}</p>
                <Link
                  href={`/shop?collection=${collection.id}`}
                  className="group inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-bold hover:text-primary transition-colors"
                >
                  Explore Collection
                  <span className="p-2 border border-border group-hover:border-primary rounded-full transition-colors">
                    <ArrowRight className="w-4 h-4" />
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
