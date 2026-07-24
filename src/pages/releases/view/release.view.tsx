import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Changelog, type ChangelogEntry } from "@/components/changelog1"
import { Changelog1Skeleton } from "../components/changelog-skeleton.component"

interface IReleaseView {
  entries?: ChangelogEntry[]
  isLoading: boolean
  isError: boolean
}

const ReleaseView = ({ entries, isLoading }: IReleaseView) => {
  return (
    <>
      <BackgroundHeaderComponent>
        <main className="relative z-10">
          <section className="md:pt-[25svh] lg:pt-[5svh]">
            {isLoading ? (
              <Changelog1Skeleton count={3} />
            ) : (
              <Changelog entries={entries} />
            )}
          </section>
        </main>
      </BackgroundHeaderComponent>
    </>
  )
}

export default ReleaseView
