import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Skeleton } from "@/components/ui/skeleton"

const ArcDetailsLoading = () => {
  return (
    <BackgroundHeaderComponent direction="left">
      <main className="absolute inset-0 overflow-y-auto">
        <section className="mx-auto flex min-h-screen w-full max-w-360 flex-col gap-8 px-6 py-8 md:px-10 lg:px-16 lg:py-12">
          <article className="rounded-3xl border border-black/10 bg-white/55 p-5 shadow-xl shadow-black/10 backdrop-blur-md sm:p-7 dark:border-white/10 dark:bg-black/40 dark:shadow-black/40">
            <div className="space-y-3">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-5 w-full max-w-3xl" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </article>

          <section className="grid min-h-[68svh] gap-6 pb-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <article className="flex flex-col gap-6 rounded-3xl border border-black/10 bg-white/45 p-5 shadow-xl shadow-black/10 backdrop-blur-md sm:p-6 md:p-7 dark:border-white/10 dark:bg-black/35 dark:shadow-black/40">
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full max-w-3xl" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={`arc-actions-skeleton-${index}`}
                    className="h-11 w-36"
                  />
                ))}
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={`arc-info-skeleton-${index}`}
                      className="h-16 w-full"
                    />
                  ))}
                </div>
              </div>
            </article>

            <aside className="flex h-full flex-col rounded-3xl border border-black/10 bg-white/45 p-5 shadow-xl shadow-black/10 backdrop-blur-md sm:p-6 md:p-7 dark:border-white/10 dark:bg-black/35 dark:shadow-black/40">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>

              <div className="mt-5 flex flex-1 items-center justify-center">
                <Skeleton className="h-105 w-full max-w-sm" />
              </div>
            </aside>
          </section>
        </section>
      </main>
    </BackgroundHeaderComponent>
  )
}

export default ArcDetailsLoading
