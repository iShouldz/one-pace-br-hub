import { useNavigate } from "react-router"
import HomeView from "../view/home.view"
import { useCallback, useMemo, useState } from "react"
import { routePath } from "@/utils/enum/routes.utils"
import { onePieceSagas } from "../utils/saga.utils"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import { StorageKeys } from "@/utils/storage-keys.utils"

const HomeController = () => {
  const navigate = useNavigate()

  const [orderSagas, setOrderSagas] = useState<boolean>(
    getFromLocalStorage(StorageKeys.ORDER_SAGAS) || false
  )

  const [showAllSagas, setShowAllSagas] = useState<boolean>(
    getFromLocalStorage(StorageKeys.SHOW_COMPLETED_SAGAS) || true
  )

  const [hideGrayscale, setHideGrayscale] = useState<boolean>(
    getFromLocalStorage(StorageKeys.HIDE_GRAYSCALE) || false
  )

  const [openSettings, setOpenSettings] = useState(false)

  const opSaga = useMemo(() => {
    if (orderSagas) {
      return [...onePieceSagas].reverse()
    }
    return onePieceSagas
  }, [orderSagas])

  const [currentOnePieceSagas, setCurrentOnePieceSagas] = useState(opSaga)

  const handleRedirectToSagaDetails = useCallback(
    (sagaId: string) => {
      navigate(routePath.sagaDetails(sagaId))
    },
    [navigate]
  )

  const handleRedirectToArcDetails = useCallback(
    (sagaId: string, arcId: string) => {
      navigate(routePath.arcDetails(sagaId, arcId))
    },
    [navigate]
  )

  const renderModalOnePaceWelcome = useMemo(() => {
    const hasShowModal = getFromLocalStorage(StorageKeys.MODAL_WELCOME)

    if (hasShowModal) {
      return false
    }

    saveToLocalStorage(StorageKeys.MODAL_WELCOME, true)
    return true
  }, [])

  const handleHideCompletedSagas = useCallback(() => {
    setShowAllSagas((prevState) => {
      saveToLocalStorage(StorageKeys.SHOW_COMPLETED_SAGAS, !prevState)
      return !prevState
    })
  }, [showAllSagas])

  const handleToggleOrderList = useCallback(() => {
    setCurrentOnePieceSagas((prevState) => {
      return [...prevState].reverse()
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

  return (
    <HomeView
      openSettings={openSettings}
      showAllSagas={showAllSagas}
      onePieceSagas={currentOnePieceSagas}
      handleHideGrayscale={handleHideGrayscale}
      handleToggleSettings={handleToggleSettings}
      handleToggleOrderList={handleToggleOrderList}
      handleHideCompletedSagas={handleHideCompletedSagas}
      renderModalOnePaceWelcome={renderModalOnePaceWelcome}
      handleRedirectToArcDetails={handleRedirectToArcDetails}
      handleRedirectToSagaDetails={handleRedirectToSagaDetails}
    />
  )
}

export default HomeController
