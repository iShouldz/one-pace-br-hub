import HomeView from "../view/home.view"
import { useCallback, useState } from "react"
import { routePath } from "@/utils/enum/routes.utils"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import { StorageKeys } from "@/utils/enum/storage-keys.utils"
import useNavigation from "@/hooks/use-navigation/use-navigation"

import useSeo from "@/hooks/use-seo"

import useDialogControl from "../hooks/use-dialog-control"
import useNotification from "../hooks/use-notification"
import type { ConfigContentKey } from "@/components/config-menu/settings-dialog"

const HomeController = () => {
  const { handleRedirect } = useNavigation()

  const {
    data,
    isLoading,
    openSettings,
    showAllSagas,
    currentTheme,
    hideGrayscale,
    handleToggleTheme,
    handleHideGrayscale,
    handleToggleSettings,
    currentOnePieceSagas,
    handleToggleOrderList,
    handleHideCompletedSagas,
  } = useDialogControl()
  const [defaultOptionOpenConfig, setDefaultOptionOpenConfig] =
    useState<ConfigContentKey>("Exibição")

  const { activeNotifications, handleCloseNotification } = useNotification({
    data,
  })

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

  const handleRedirectToSagaDetails = useCallback(
    (sagaId: string) => {
      handleRedirect(routePath.sagaDetails(sagaId))
    },
    [handleRedirect]
  )

  const handleRedirectNotifyButton = useCallback(
    (path?: string) => {
      if (!path) return
      handleRedirect(path)
    },
    [handleRedirect]
  )

  const handleRedirectToArcDetails = useCallback(
    (sagaId: string, arcId: string) => {
      handleRedirect(routePath.arcDetails(sagaId, arcId))
    },
    [handleRedirect]
  )

  const handleRedirectToSubtitleRepo = useCallback(() => {
    handleRedirect("https://github.com/iShouldz/one-pace-br-hub-legendas", {
      external: true,
    })
  }, [handleRedirect])

  const handleCloseWelcomeModal = useCallback(() => {
    setRenderModalOnePaceWelcome(false)
    saveToLocalStorage(StorageKeys.MODAL_WELCOME, true)
  }, [])

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

  const handleOpenSettingsMenu = useCallback(() => {
    setDefaultOptionOpenConfig("Exibição")
    handleToggleSettings()
  }, [handleToggleSettings])

  const handleTriggerStremioAddonHeader = useCallback(() => {
    setDefaultOptionOpenConfig("Stremio Addon")
    handleToggleSettings()
  }, [handleToggleSettings])

  useSeo({
    title: "One Pace BR Hub | One Pace Legendado PT-BR",
    description:
      "Hub brasileiro do One Pace com sagas organizadas, links por arco e legendas PT-BR. Encontre East Blue, Alabasta, Water Seven, Wano e mais.",
    path: "/",
    keywords:
      "one pace pt br, one pace legendado, one pace brasil, one pace east blue legendado",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "One Pace BR Hub",
      inLanguage: "pt-BR",
      url: "/",
      potentialAction: {
        "@type": "SearchAction",
        target: "/saga/{sagaId}",
        "query-input": "required name=sagaId",
      },
    },
  })

  return (
    <HomeView
      isLoading={isLoading}
      currentTheme={currentTheme}
      openSettings={openSettings}
      showAllSagas={showAllSagas}
      hideGrayscale={hideGrayscale}
      onePieceSagas={currentOnePieceSagas}
      handleToggleTheme={handleToggleTheme}
      notificationData={activeNotifications}
      handleHideGrayscale={handleHideGrayscale}
      handleRedirectToForm={handleRedirectToForm}
      handleToggleSettings={handleToggleSettings}
      handleToggleOrderList={handleToggleOrderList}
      handleOpenSettingsMenu={handleOpenSettingsMenu}
      defaultOptionOpenConfig={defaultOptionOpenConfig}
      handleCloseNotification={handleCloseNotification}
      handleCloseWelcomeModal={handleCloseWelcomeModal}
      handleHideCompletedSagas={handleHideCompletedSagas}
      renderModalOnePaceWelcome={renderModalOnePaceWelcome}
      handleRedirectNotifyButton={handleRedirectNotifyButton}
      handleRedirectToArcDetails={handleRedirectToArcDetails}
      handleRedirectToSagaDetails={handleRedirectToSagaDetails}
      handleRedirectToSubtitleRepo={handleRedirectToSubtitleRepo}
      handleRedirectToIssuesGithub={handleRedirectToIssuesGithub}
      handleTriggerStremioAddonHeader={handleTriggerStremioAddonHeader}
      handleRedirectToIssuesGithubSubttitle={
        handleRedirectToIssuesGithubSubttitle
      }
    />
  )
}

export default HomeController
