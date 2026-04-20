import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import SagaList from "../components/SagaList/saga-list.component"

const HomeView = () => {
  return (
    <div className="relative isolate w-full overflow-x-hidden bg-[#050918] text-white">
      <BackgroundHeaderComponent />

      <main className="relative z-10">
        <section className="pointer-events-none absolute inset-x-0 top-0 flex h-[50svh] items-center">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="flex justify-center">
              <img
                src="/one-pace-logo.png"
                alt="One Pace Logo"
                className="w-64 max-w-full object-contain sm:w-90 md:w-125"
              />
            </div>
          </div>
        </section>

        <section className="pt-[60svh]">
          <SagaList />
        </section>
      </main>
    </div>
  )
}

export default HomeView
