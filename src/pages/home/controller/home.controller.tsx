import { useNavigate } from "react-router"
import HomeView from "../view/home.view"
import { useCallback } from "react"
import { routePath } from "@/utils/enum/routes.utils"

const HomeController = () => {
  const navigate = useNavigate()
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
  return (
    <HomeView
      handleRedirectToSagaDetails={handleRedirectToSagaDetails}
      handleRedirectToArcDetails={handleRedirectToArcDetails}
    />
  )
}

export default HomeController
