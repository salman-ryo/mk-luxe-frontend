export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 bg-midnight-charcoal">
      <div className="mb-12">
        <div className="h-10 w-48 bg-card animate-pulse mb-4" />
        <div className="h-4 w-64 bg-card animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-72 space-y-8">
          <div className="h-64 bg-card animate-pulse" />
          <div className="h-24 bg-card animate-pulse" />
          <div className="h-24 bg-card animate-pulse" />
        </aside>

        <div className="flex-1">
          <div className="h-12 bg-card animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-square bg-card animate-pulse" />
                <div className="h-4 w-3/4 bg-card animate-pulse" />
                <div className="h-4 w-1/2 bg-card animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}