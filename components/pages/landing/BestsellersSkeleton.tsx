const SKELETON_COUNT = 3;

export default function BestsellersSkeleton() {
  return (
    <section className="pb-24 px-16 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section heading skeleton */}
        <div className="h-5 w-36 bg-deep-slate rounded animate-pulse mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-deep-slate border border-border p-8 flex items-center gap-8 rounded-lg"
            >
              {/* Image skeleton */}
              <div className="shrink-0 w-32 h-32 rounded bg-midnight-charcoal/60 animate-pulse" />

              {/* Text skeleton */}
              <div className="w-1/2 flex flex-col gap-3">
                <div className="h-4 w-28 bg-midnight-charcoal/60 rounded animate-pulse" />
                <div className="h-4 w-20 bg-midnight-charcoal/60 rounded animate-pulse" />
                {/* Button skeleton */}
                <div className="h-8 w-24 bg-midnight-charcoal/60 rounded animate-pulse mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}