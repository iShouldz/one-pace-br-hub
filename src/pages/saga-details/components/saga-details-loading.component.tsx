import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Skeleton } from "@/components/ui/skeleton"

const SagaDetailsLoading = () => {
  return (
    <BackgroundHeaderComponent
      direction="left"
      imageUrl="/images/wallpaper-background.webp"
    >
      <main className="absolute inset-0 overflow-y-auto">
        <section className="mx-auto flex min-h-screen w-full max-w-360 flex-col gap-8 px-6 py-8 md:px-10 lg:px-16 lg:py-12">
          <article className="rounded-3xl border border-black/10 bg-white/55 p-5 shadow-xl shadow-black/10 backdrop-blur-md sm:p-7 dark:border-white/10 dark:bg-black/40 dark:shadow-black/40">
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-5 w-full max-w-3xl" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </article>

          <section className="rounded-3xl border border-black/10 bg-white/45 p-4 shadow-xl shadow-black/10 backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-black/35 dark:shadow-black/40">
            <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-72" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={`saga-details-skeleton-${index}`}
                  className="aspect-2/3 w-full"
                />
              ))}
            </div>
          </section>
        </section>
      </main>
    </BackgroundHeaderComponent>
  )
}

export default SagaDetailsLoading
