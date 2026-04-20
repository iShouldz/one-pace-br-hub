import { useNavigate } from "react-router"
import HomeView from "../view/home.view"
import { useCallback } from "react"

const HomeController = () => {
  const navigate = useNavigate()
  const handleRedirectToSagaDetails = useCallback(
    (sagaId: string) => {
      navigate(`/saga/${sagaId}`)
    },
    [navigate]
  )
  return <HomeView handleRedirectToSagaDetails={handleRedirectToSagaDetails} />
}

export default HomeController
