export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16 animate-pulse">
      {/* Breadcrumb + Title */}
      <div className="mb-10">
        <div className="h-10 w-2/3 bg-card rounded mb-4" />
        <div className="h-4 w-1/3 bg-card rounded" />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT: Image skeleton */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl border border-border bg-card" />

          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl border border-border bg-card" />
            ))}
          </div>
        </div>

        {/* RIGHT: Info skeleton */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-card rounded-full" />
            <div className="h-6 w-24 bg-card rounded-full" />
          </div>

          {/* Title */}
          <div className="h-8 w-3/4 bg-card rounded" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-card rounded" />
            <div className="h-4 w-5/6 bg-card rounded" />
            <div className="h-4 w-2/3 bg-card rounded" />
          </div>

          {/* Rating */}
          <div className="flex gap-3 items-center">
            <div className="h-4 w-24 bg-card rounded" />
            <div className="h-4 w-16 bg-card rounded" />
          </div>

          {/* Price box */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="h-8 w-40 bg-background rounded" />
            <div className="h-4 w-32 bg-background rounded" />
          </div>

          {/* Variants */}
          <div className="space-y-3">
            <div className="h-4 w-24 bg-card rounded" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl border border-border bg-card" />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="h-12 w-40 bg-card rounded-xl" />

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-card rounded-2xl" />
            <div className="h-12 bg-card rounded-2xl" />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-card rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom sections */}
      <div className="mt-16 space-y-6">
        <div className="h-6 w-40 bg-card rounded" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-40 bg-card rounded-2xl" />
          <div className="h-40 bg-card rounded-2xl" />
        </div>

        <div className="h-40 bg-card rounded-2xl" />
      </div>
    </div>
  )
}