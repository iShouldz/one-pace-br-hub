import { useNavigate } from "react-router"
import HomeView from "../view/home.view"
import { useCallback, useState } from "react"
import { routePath } from "@/utils/enum/routes.utils"
import { onePieceSagas } from "../utils/saga.utils"

const HomeController = () => {
  const navigate = useNavigate()
  const [showAllSagas, setShowAllSagas] = useState(false)
  const [currentOnePieceSagas, setCurrentOnePieceSagas] =
    useState(onePieceSagas)
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

  const handleHideCompletedSagas = useCallback(() => {
    setShowAllSagas((prevState) => !prevState)
  }, [])

  const handleToggleOrderList = useCallback(() => {
    setCurrentOnePieceSagas((prevState) => [...prevState].reverse())
  }, [])

  return (
    <HomeView
      showAllSagas={showAllSagas}
      onePieceSagas={currentOnePieceSagas}
      handleToggleOrderList={handleToggleOrderList}
      handleHideCompletedSagas={handleHideCompletedSagas}
      handleRedirectToArcDetails={handleRedirectToArcDetails}
      handleRedirectToSagaDetails={handleRedirectToSagaDetails}
    />
  )
}

export default HomeController
