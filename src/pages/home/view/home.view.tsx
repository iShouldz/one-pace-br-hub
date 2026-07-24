import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import SagaList from "../components/SagaList/saga-list.component"
import SagaListLoading from "../components/SagaList/saga-list-loading.component"
import type { IHomeView } from "../types"

const HomeView = ({
  isLoading,
  showAllSagas,
  onePieceSagas,
  handleRedirectToArcDetails,
  handleRedirectToSagaDetails,
}: IHomeView) => {
  return (
    <BackgroundHeaderComponent>
      <section className="pointer-events-none absolute inset-x-0 top-0 flex items-center md:h-[30svh] lg:h-[60svh]">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="flex justify-center">
            <img
              src="images/one-pace-logo.webp"
              alt="One Pace Logo"
              loading="lazy"
              className="w-200 object-contain"
            />
          </div>
        </div>
      </section>

      {isLoading ? (
        <SagaListLoading />
      ) : (
        <section className="md:pt-[25svh] lg:pt-[65svh] z-50 relative">
          <SagaList
            showAllSagas={showAllSagas}
            onePieceSagas={onePieceSagas}
            handleRedirectToArcDetails={handleRedirectToArcDetails}
            handleRedirectToSagaDetails={handleRedirectToSagaDetails}
          />
        </section>
      )}
    </BackgroundHeaderComponent>
  )
}

export default HomeView
