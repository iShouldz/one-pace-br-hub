import SagaList from "../components/SagaList/saga-list.component"

const HomeView = () => {
  return (
    <div className="relative isolate min-h-screen w-full overflow-x-hidden bg-[#050918] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[82svh] min-h-135 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/wallpaper-background.png')" }}
        />

        <div className="absolute inset-0 bg-black/35" />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(130% 75% at 50% 10%, rgba(5,9,24,0) 35%, rgba(5,9,24,0.35) 65%, rgba(5,9,24,0.78) 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(5,9,24,0.08) 0%, rgba(5,9,24,0.22) 36%, rgba(5,9,24,0.65) 70%, rgba(5,9,24,0.94) 88%, #050918 100%)",
          }}
        />
      </div>

      <main className="relative z-10">
        <section className="pointer-events-none absolute inset-x-0 top-0 flex h-[82svh] items-center">
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
