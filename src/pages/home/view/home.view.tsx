import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import SagaList from "../components/SagaList/saga-list.component"
import SagaListLoading from "../components/SagaList/saga-list-loading.component"
import type { IHomeView } from "../types"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SettingsDialog } from "@/components/config-menu/settings-dialog"

import WelcomeModalComponent from "../components/welcome-modal/welcome-modal.component"
import NotificationListComponent from "../components/notification-list/notification-list.component"

const HomeView = ({
  isLoading,
  currentTheme,
  openSettings,
  showAllSagas,
  hideGrayscale,
  onePieceSagas,
  notificationData,
  handleToggleTheme,
  handleHideGrayscale,
  handleRedirectToForm,
  handleToggleSettings,
  handleToggleOrderList,
  handleCloseNotification,
  handleCloseWelcomeModal,
  handleHideCompletedSagas,
  renderModalOnePaceWelcome,
  handleRedirectToArcDetails,
  handleRedirectNotifyButton,
  handleRedirectToSagaDetails,
  handleRedirectToIssuesGithub,
}: IHomeView) => {
  return (
    <>
      <BackgroundHeaderComponent>
        <NotificationListComponent
          notificationData={notificationData}
          handleRedirectNotifyButton={handleRedirectNotifyButton}
          handleCloseNotification={handleCloseNotification}
        />

        <WelcomeModalComponent
          handleCloseWelcomeModal={handleCloseWelcomeModal}
          renderModalOnePaceWelcome={renderModalOnePaceWelcome}
        />

        <Button
          variant="ghost"
          onClick={handleToggleSettings}
          className="fixed top-5 left-3 z-50 bg-white/60 shadow-sm ring-1 ring-black/10 backdrop-blur-md dark:bg-black/40 dark:ring-white/10"
          aria-label="Abrir menu"
        >
          Menu{" "}
          <Menu className="size-5 text-neutral-700 dark:text-neutral-200" />
        </Button>

        <main className="relative z-10">
          <SettingsDialog
            currentTheme={currentTheme}
            openSettings={openSettings}
            hideGrayscale={hideGrayscale}
            handleToggleTheme={handleToggleTheme}
            handleHideGrayscale={handleHideGrayscale}
            handleRedirectToForm={handleRedirectToForm}
            handleToggleSettings={handleToggleSettings}
            handleToggleOrderList={handleToggleOrderList}
            handleHideCompletedSagas={handleHideCompletedSagas}
            handleRedirectToIssuesGithub={handleRedirectToIssuesGithub}
          />

          <section className="pointer-events-none absolute inset-x-0 top-0 flex h-[60svh] items-center">
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
            <section className="md:pt-[35svh] lg:pt-[55svh]">
              <SagaList
                showAllSagas={showAllSagas}
                onePieceSagas={onePieceSagas}
                handleRedirectToArcDetails={handleRedirectToArcDetails}
                handleRedirectToSagaDetails={handleRedirectToSagaDetails}
              />
            </section>
          )}
        </main>
      </BackgroundHeaderComponent>
    </>
  )
}

export default HomeView
