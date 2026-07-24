import { Skeleton } from "@/components/ui/skeleton"

const SagaListLoading = () => {
  return (
    <section className="flex flex-col gap-16 md:pt-[35svh] lg:pt-[65svh]">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          className="mx-auto flex w-full flex-col gap-8 px-5 sm:px-8"
          key={index}
        >
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`saga-skeleton-${i}`} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default SagaListLoading
