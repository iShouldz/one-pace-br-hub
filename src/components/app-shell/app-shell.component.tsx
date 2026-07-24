import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { Outlet } from "react-router"
import { ChevronLeft, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SettingsDialog,
  type ConfigContentKey,
} from "@/components/config-menu/settings-dialog"
import NotificationListComponent from "@/pages/home/components/notification-list/notification-list.component"
import WelcomeModalComponent from "@/pages/home/components/welcome-modal/welcome-modal.component"
import HeaderComponent from "@/pages/home/components/Header/header.component"
import useDialogControl from "@/pages/home/hooks/use-dialog-control"
import useNotification from "@/pages/home/hooks/use-notification"
import { StorageKeys } from "@/utils/enum/storage-keys.utils"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import useNavigation from "@/hooks/use-navigation/use-navigation"

type AppShellContextValue = {
  isLoading: boolean
  handleBack: () => void
  isHomePage: boolean
  currentTheme: "light" | "dark"
  openSettings: boolean
  hideGrayscale: boolean
  showAllSagas: boolean
  onePieceSagas: ReturnType<typeof useDialogControl>["currentOnePieceSagas"]
  handleToggleTheme: () => void
  handleHideGrayscale: () => void
  handleToggleSettings: () => void
  handleToggleOrderList: () => void
  handleHideCompletedSagas: () => void
  handleOpenSettingsMenu: () => void
  handleTriggerStremioAddonHeader: () => void
  handleRedirectToForm: () => void
  handleRedirectToIssuesGithub: () => void
  handleRedirectToIssuesGithubSubttitle: () => void
  handleRedirectNotifyButton: (path?: string) => void
  handleCloseNotification: (
    notification: Parameters<
      ReturnType<typeof useNotification>["handleCloseNotification"]
    >[0]
  ) => void
  notificationData: ReturnType<typeof useNotification>["activeNotifications"]
  defaultOptionOpenConfig: ConfigContentKey
  renderModalOnePaceWelcome: boolean
  handleCloseWelcomeModal: () => void
}

const AppShellContext = createContext<AppShellContextValue | undefined>(
  undefined
)

export const AppShellProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { handleRedirect, handleBack } = useNavigation()
  const {
    data,
    isLoading,
    openSettings,
    currentTheme,
    hideGrayscale,
    handleToggleTheme,
    handleHideGrayscale,
    handleToggleSettings,
    currentOnePieceSagas,
    handleToggleOrderList,
    handleHideCompletedSagas,
  } = useDialogControl()

  const { activeNotifications, handleCloseNotification } = useNotification({
    data,
  })
  const [defaultOptionOpenConfig, setDefaultOptionOpenConfig] =
    useState<ConfigContentKey>("Exibição")

  const [renderModalOnePaceWelcome, setRenderModalOnePaceWelcome] = useState(
    () => {
      const hasShowModal = getFromLocalStorage(StorageKeys.MODAL_WELCOME)

      if (hasShowModal) {
        return false
      }

      saveToLocalStorage(StorageKeys.MODAL_WELCOME, true)
      return true
    }
  )

  const handleOpenSettingsMenu = useCallback(() => {
    setDefaultOptionOpenConfig("Exibição")
    handleToggleSettings()
  }, [handleToggleSettings])

  const handleTriggerStremioAddonHeader = useCallback(() => {
    setDefaultOptionOpenConfig("Stremio Addon")
    handleToggleSettings()
  }, [handleToggleSettings])

  const handleRedirectToForm = useCallback(() => {
    handleRedirect("https://forms.gle/F9BZtrJ8pjywnhqw7", { external: true })
  }, [handleRedirect])

  const handleRedirectToIssuesGithub = useCallback(() => {
    handleRedirect("https://github.com/iShouldz/one-pace-br-hub/issues/new", {
      external: true,
    })
  }, [handleRedirect])

  const handleRedirectToIssuesGithubSubttitle = useCallback(() => {
    handleRedirect(
      "https://github.com/iShouldz/one-pace-br-hub-legendas/issues/new",
      {
        external: true,
      }
    )
  }, [handleRedirect])

  const handleRedirectNotifyButton = useCallback(
    (path?: string) => {
      if (!path) return
      handleRedirect(path)
    },
    [handleRedirect]
  )

  const handleCloseWelcomeModal = useCallback(() => {
    setRenderModalOnePaceWelcome(false)
    saveToLocalStorage(StorageKeys.MODAL_WELCOME, true)
  }, [])
  const isHomePage = window.location.pathname === "/"
  const value = useMemo<AppShellContextValue>(
    () => ({
      isLoading,
      handleBack,
      currentTheme,
      openSettings,
      hideGrayscale,
      showAllSagas: true,
      onePieceSagas: currentOnePieceSagas,
      handleToggleTheme,
      handleHideGrayscale,
      handleToggleSettings,
      handleToggleOrderList,
      handleHideCompletedSagas,
      handleOpenSettingsMenu,
      handleTriggerStremioAddonHeader,
      handleRedirectToForm,
      handleRedirectToIssuesGithub,
      handleRedirectToIssuesGithubSubttitle,
      handleRedirectNotifyButton,
      handleCloseNotification,
      notificationData: activeNotifications,
      defaultOptionOpenConfig,
      renderModalOnePaceWelcome,
      handleCloseWelcomeModal,
      isHomePage,
    }),
    [
      activeNotifications,
      currentOnePieceSagas,
      currentTheme,
      defaultOptionOpenConfig,
      handleCloseNotification,
      handleCloseWelcomeModal,
      handleHideCompletedSagas,
      handleHideGrayscale,
      handleOpenSettingsMenu,
      handleRedirectNotifyButton,
      handleRedirectToForm,
      handleRedirectToIssuesGithub,
      handleRedirectToIssuesGithubSubttitle,
      handleToggleOrderList,
      handleToggleSettings,
      handleToggleTheme,
      handleTriggerStremioAddonHeader,
      hideGrayscale,
      isLoading,
      isHomePage,
      handleBack,
      openSettings,
      renderModalOnePaceWelcome,
    ]
  )

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  )
}

export const useAppShell = () => {
  const context = useContext(AppShellContext)

  if (!context) {
    throw new Error("useAppShell must be used within an AppShellProvider")
  }

  return context
}

const AppShellLayout = () => {
  const {
    handleOpenSettingsMenu,
    handleTriggerStremioAddonHeader,
    handleCloseNotification,
    handleRedirectNotifyButton,
    notificationData,
    currentTheme,
    openSettings,
    hideGrayscale,
    handleToggleTheme,
    handleHideGrayscale,
    handleToggleSettings,
    handleToggleOrderList,
    handleHideCompletedSagas,
    handleRedirectToForm,
    handleRedirectToIssuesGithub,
    handleRedirectToIssuesGithubSubttitle,
    defaultOptionOpenConfig,
    renderModalOnePaceWelcome,
    handleCloseWelcomeModal,
    isHomePage,
    handleBack,
  } = useAppShell()

  return (
    <div className="relative isolate min-h-svh w-full bg-transparent">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-70">
        <div className="pointer-events-auto">
          {isHomePage && (
            <NotificationListComponent
              notificationData={notificationData}
              handleCloseNotification={handleCloseNotification}
              handleRedirectNotifyButton={handleRedirectNotifyButton}
            />
          )}

          <WelcomeModalComponent
            handleCloseWelcomeModal={handleCloseWelcomeModal}
            renderModalOnePaceWelcome={renderModalOnePaceWelcome}
          />

          <div className="fixed top-5 left-3 flex gap-2">
            {!isHomePage && (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="z-50 bg-white/60 shadow-sm ring-1 ring-black/10 backdrop-blur-md dark:bg-black/40 dark:ring-white/10"
                aria-label="Abrir menu"
              >
                <ChevronLeft />
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={handleOpenSettingsMenu}
              className="z-50 bg-white/60 shadow-sm ring-1 ring-black/10 backdrop-blur-md dark:bg-black/40 dark:ring-white/10"
              aria-label="Abrir menu"
            >
              Menu{" "}
              <Menu className="size-5 text-neutral-700 dark:text-neutral-200" />
            </Button>
          </div>

          <HeaderComponent
            handleTriggerStremioAddonHeader={handleTriggerStremioAddonHeader}
          />

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
            handleRedirectToIssuesGithubSubttitle={
              handleRedirectToIssuesGithubSubttitle
            }
          />
        </div>
      </div>

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  )
}

export default function AppShell() {
  return (
    <AppShellProvider>
      <AppShellLayout />
    </AppShellProvider>
  )
}
