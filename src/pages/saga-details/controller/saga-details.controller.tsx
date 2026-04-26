import { useParams } from "react-router"
import SagaDetailsView from "../view/saga-details.view"
import { useCallback, useMemo } from "react"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { routePath } from "@/utils/enum/routes.utils"
import useOpData from "@/pages/home/hooks/use-op-data"

const SagaDetailsController = () => {
  const { sagaId } = useParams()
  const { data} = useOpData()
  const { handleRedirect, handleBack } = useNavigation()

  const currentSagaData = useMemo(
    () => data?.sagas?.find((saga) => saga.id === sagaId),
    [sagaId]
  )

  const handleRedirectToArcDetails = useCallback(
    (sagaId: string, arcId: string) => {
      handleRedirect(routePath.arcDetails(sagaId, arcId))
    },
    [handleRedirect]
  )

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
