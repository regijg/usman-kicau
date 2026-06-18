export default function Loading() {
  return (
    <main className="min-h-screen bg-amber-50 dark:bg-stone-950">
      {/* Hero skeleton */}
      <div className="h-72 md:h-96 skeleton" />

      {/* Bird catalog skeleton */}
      <section className="py-16 bg-amber-50 dark:bg-stone-900">
        <div className="container-custom">
          <div className="text-center mb-8 space-y-3">
            <div className="h-6 w-36 skeleton rounded-full mx-auto" />
            <div className="h-10 w-64 skeleton rounded-xl mx-auto" />
            <div className="h-4 w-80 skeleton rounded mx-auto" />
          </div>
          <div className="h-10 w-64 skeleton rounded-xl mx-auto mb-8" />
          <div className="flex gap-2 mb-8 overflow-hidden">
            {[80, 70, 90, 80, 70].map((w, i) => (
              <div key={i} className={`h-8 w-${w === 70 ? '16' : w === 80 ? '20' : '24'} skeleton rounded-full flex-shrink-0`} />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800">
                <div className="h-44 skeleton" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-9 skeleton rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pakan skeleton */}
      <section className="py-16 bg-white dark:bg-stone-950">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-3">
            <div className="h-6 w-36 skeleton rounded-full mx-auto" />
            <div className="h-10 w-56 skeleton rounded-xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800">
                <div className="h-52 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-6 skeleton rounded w-2/3" />
                  <div className="h-4 skeleton rounded" />
                  <div className="h-4 skeleton rounded w-4/5" />
                  <div className="h-10 skeleton rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
