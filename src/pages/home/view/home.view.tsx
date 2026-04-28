import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import SagaList from "../components/SagaList/saga-list.component"
import SagaListLoading from "../components/SagaList/saga-list-loading.component"
import type { IHomeView } from "../types"
import { ArrowUpRight, InfoIcon, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SettingsDialog } from "@/components/config-menu/settings-dialog"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import WelcomeModalComponent from "../components/welcome-modal/welcome-modal.component"

const HomeView = ({
  isLoading,
  currentTheme,
  openSettings,
  showAllSagas,
  hideGrayscale,
  onePieceSagas,
  notificationData,
  handleToggleTheme,
  closedNotifications,
  handleHideGrayscale,
  handleRedirectToForm,
  handleToggleSettings,
  handleToggleOrderList,
  handleCloseWelcomeModal,
  handleHideCompletedSagas,
  renderModalOnePaceWelcome,
  handleRedirectToArcDetails,
  handleRedirectNotifyButton,
  handleRedirectToSagaDetails,
  handleRedirectToIssuesGithub,
  handleToggleCloseNotifications,
}: IHomeView) => {
  return (
    <>
      <BackgroundHeaderComponent>
        {notificationData &&
          closedNotifications &&
          notificationData.notifications.map((notification) => (
            <Alert
              className="relative z-20 m-2 flex items-center justify-center"
              key={notification.title}
            >
              <InfoIcon />
              <AlertTitle>{notification.title}</AlertTitle>
              <AlertDescription className="flex items-center justify-center">
                {notification.description}{" "}
              </AlertDescription>
              <Button
                variant="ghost"
                onClick={() =>
                  handleRedirectNotifyButton(notification.buttonUrl)
                }
              >
                {notification.buttonText} <ArrowUpRight />
              </Button>
              <AlertAction>
                <Button
                  variant="ghost"
                  onClick={handleToggleCloseNotifications}
                >
                  <X />
                </Button>
              </AlertAction>
            </Alert>
          ))}

        <WelcomeModalComponent
          handleCloseWelcomeModal={handleCloseWelcomeModal}
          renderModalOnePaceWelcome={renderModalOnePaceWelcome}
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
            handleHideCompletedSagas={handleHideCompletedSagas}
            handleRedirectToIssuesGithub={handleRedirectToIssuesGithub}
          />

          <Button
            variant="ghost"
            onClick={handleToggleSettings}
            className="fixed top-3 left-3 z-40 bg-white/60 shadow-sm ring-1 ring-black/10 backdrop-blur-md dark:bg-black/40 dark:ring-white/10"
            aria-label="Abrir menu"
          >
            Menu{" "}
            <Menu className="size-5 text-neutral-700 dark:text-neutral-200" />
          </Button>

          <section className="pointer-events-none absolute inset-x-0 top-0 flex h-[50svh] items-center">
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
            <section className="md:pt-[35svh] lg:pt-[45svh]">
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
