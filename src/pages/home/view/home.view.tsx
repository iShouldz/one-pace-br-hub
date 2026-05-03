import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import SagaList from "../components/SagaList/saga-list.component"
import SagaListLoading from "../components/SagaList/saga-list-loading.component"
import type { IHomeView } from "../types"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SettingsDialog } from "@/components/config-menu/settings-dialog"

import WelcomeModalComponent from "../components/welcome-modal/welcome-modal.component"
import NotificationListComponent from "../components/notification-list/notification-list.component"
import HeaderComponent from "../components/Header/header.component"

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
  handleOpenSettingsMenu,
  handleToggleOrderList,
  handleCloseNotification,
  handleCloseWelcomeModal,
  defaultOptionOpenConfig,
  handleHideCompletedSagas,
  renderModalOnePaceWelcome,
  handleRedirectToArcDetails,
  handleRedirectNotifyButton,
  handleRedirectToSagaDetails,
  handleRedirectToIssuesGithub,
  handleTriggerStremioAddonHeader,
}: IHomeView) => {
  return (
    <>
      <BackgroundHeaderComponent>
        <NotificationListComponent
          notificationData={notificationData}
          handleCloseNotification={handleCloseNotification}
          handleRedirectNotifyButton={handleRedirectNotifyButton}
        />

        <WelcomeModalComponent
          handleCloseWelcomeModal={handleCloseWelcomeModal}
          renderModalOnePaceWelcome={renderModalOnePaceWelcome}
        />

        <Button
          variant="ghost"
          onClick={handleOpenSettingsMenu}
          className="fixed top-5 left-3 z-50 bg-white/60 shadow-sm ring-1 ring-black/10 backdrop-blur-md dark:bg-black/40 dark:ring-white/10"
          aria-label="Abrir menu"
        >
          Menu{" "}
          <Menu className="size-5 text-neutral-700 dark:text-neutral-200" />
        </Button>

        <HeaderComponent
          handleTriggerStremioAddonHeader={handleTriggerStremioAddonHeader}
        />

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
            defaultOptionOpenConfig={defaultOptionOpenConfig}
            handleHideCompletedSagas={handleHideCompletedSagas}
            handleRedirectToIssuesGithub={handleRedirectToIssuesGithub}
          />

          <section className="pointer-events-none absolute inset-x-0 top-0 flex lg:h-[60svh] items-center md:h-[30svh]">
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
            <section className="md:pt-[25svh] lg:pt-[55svh]">
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
