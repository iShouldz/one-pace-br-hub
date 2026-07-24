import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface Changelog1SkeletonProps {
  className?: string
  count?: number
}

export const Changelog1Skeleton = ({
  className,
  count = 3,
}: Changelog1SkeletonProps) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="mb-4 h-10 w-64 md:h-14 md:w-80" />
          <Skeleton className="h-5 w-full max-w-2xl" />
          <Skeleton className="mt-2 h-5 w-3/4 max-w-xl" />
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-16 md:mt-24 md:space-y-24">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-4 md:flex-row md:gap-16"
            >
              <div className="top-8 flex h-min w-64 shrink-0 items-center gap-4 md:sticky">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="flex flex-1 flex-col">
                <Skeleton className="mb-3 h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <Skeleton className="mt-2 h-4 w-2/3" />

                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                <Skeleton className="mt-8 h-40 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
