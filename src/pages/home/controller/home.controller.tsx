import HomeView from "../view/home.view"
import { useCallback, useEffect, useMemo, useState } from "react"
import { routePath } from "@/utils/enum/routes.utils"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import { StorageKeys } from "@/utils/enum/storage-keys.utils"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import useOpData from "../hooks/use-op-data"
import { useTheme, type ResolvedTheme } from "@/components/theme-provider"
import useSeo from "@/hooks/use-seo"

const HomeController = () => {
  const { theme, setTheme } = useTheme()
  const { data, isLoading } = useOpData()
  const { handleRedirect } = useNavigation()

  const [orderSagas, setOrderSagas] = useState<boolean>(
    getFromLocalStorage(StorageKeys.ORDER_SAGAS) ?? false
  )

  const [openSettings, setOpenSettings] = useState(false)

  const [showAllSagas, setShowAllSagas] = useState<boolean>(
    getFromLocalStorage(StorageKeys.SHOW_COMPLETED_SAGAS) ?? true
  )

  const [hideGrayscale, setHideGrayscale] = useState<boolean>(
    getFromLocalStorage(StorageKeys.HIDE_GRAYSCALE) ?? false
  )

  const currentTheme: ResolvedTheme = theme === "light" ? "light" : "dark"

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

  const opSaga = useMemo(() => {
    if (!data || !orderSagas) {
      return data
    }

    return {
      ...data,
      sagas: [...(data.sagas ?? [])].reverse(),
    }
  }, [data, orderSagas])

  const [currentOnePieceSagas, setCurrentOnePieceSagas] = useState(opSaga)

  const handleRedirectToSagaDetails = useCallback(
    (sagaId: string) => {
      handleRedirect(routePath.sagaDetails(sagaId))
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

  const handleHideCompletedSagas = useCallback(() => {
    setShowAllSagas((prevState) => {
      saveToLocalStorage(StorageKeys.SHOW_COMPLETED_SAGAS, !prevState)
      return !prevState
    })
  }, [])

  const handleToggleOrderList = useCallback(() => {
    setCurrentOnePieceSagas((prevState) => {
      if (!prevState || !prevState.sagas) {
        return prevState
      }

      return {
        ...prevState,
        sagas: [...prevState.sagas].reverse(),
      }
    })

    setOrderSagas((prevState) => {
      saveToLocalStorage(StorageKeys.ORDER_SAGAS, !prevState)
      return !prevState
    })
  }, [])

  const handleHideGrayscale = useCallback(() => {
    setHideGrayscale((prevState) => {
      saveToLocalStorage(StorageKeys.HIDE_GRAYSCALE, !prevState)
      return !prevState
    })
  }, [])

  const handleToggleSettings = useCallback(() => {
    setOpenSettings((prev) => !prev)
  }, [])

  const handleToggleTheme = useCallback(() => {
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }, [currentTheme, setTheme])

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

  useEffect(() => {
    setCurrentOnePieceSagas(opSaga)
  }, [opSaga])

  return (
    <HomeView
      isLoading={isLoading}
      currentTheme={currentTheme}
      openSettings={openSettings}
      showAllSagas={showAllSagas}
      hideGrayscale={hideGrayscale}
      onePieceSagas={currentOnePieceSagas}
      handleToggleTheme={handleToggleTheme}
      handleHideGrayscale={handleHideGrayscale}
      handleToggleSettings={handleToggleSettings}
      handleToggleOrderList={handleToggleOrderList}
      handleCloseWelcomeModal={handleCloseWelcomeModal}
      handleHideCompletedSagas={handleHideCompletedSagas}
      renderModalOnePaceWelcome={renderModalOnePaceWelcome}
      handleRedirectToArcDetails={handleRedirectToArcDetails}
      handleRedirectToSagaDetails={handleRedirectToSagaDetails}
      handleRedirectToSubtitleRepo={handleRedirectToSubtitleRepo}
    />
  )
}

export default HomeController
