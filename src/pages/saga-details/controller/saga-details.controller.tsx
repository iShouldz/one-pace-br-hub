import { useParams } from "react-router"
import SagaDetailsView from "../view/saga-details.view"
import { onePieceSagas } from "@/pages/home/utils/saga.utils"
import { useCallback, useMemo } from "react"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { routePath, RoutesUrl } from "@/utils/enum/routes.utils"

const SagaDetailsController = () => {
  const { sagaId } = useParams()
  const { handleRedirect } = useNavigation()

  const currentSagaData = useMemo(
    () => onePieceSagas.find((saga) => saga.id === sagaId),
    [sagaId]
  )

  const handleRedirectToArcDetails = useCallback(
    (sagaId: string, arcId: string) => {
      handleRedirect(routePath.arcDetails(sagaId, arcId))
    },
    [handleRedirect]
  )

  const handleBack = useCallback(() => {
    handleRedirect(RoutesUrl.HOME)
  }, [handleRedirect])

  return (
    <SagaDetailsView
      sagaId={sagaId!}
      data={currentSagaData}
      handleClickBack={handleBack}
      handleRedirectToArcDetails={handleRedirectToArcDetails}
    />
  )
}

export default SagaDetailsController
