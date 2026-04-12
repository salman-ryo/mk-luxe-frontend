const SKELETON_COUNT = 8;

export default function FeaturedCategoriesSkeleton() {
  return (
    <section className="py-24 px-16 bg-midnight-charcoal">
      <div className="container mx-auto px-4">
        {/* Section heading skeleton */}
        <div className="h-5 w-52 bg-deep-slate rounded animate-pulse mb-12" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="aspect-square flex flex-col items-center justify-center gap-3 bg-deep-slate rounded-lg"
            >
              {/* Circle skeleton */}
              <div className="w-40 h-40 rounded-full bg-midnight-charcoal/60 animate-pulse border-2 border-champagne-gold/20" />
              {/* Label skeleton */}
              <div className="h-3 w-20 bg-midnight-charcoal/60 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}