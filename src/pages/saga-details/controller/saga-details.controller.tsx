import {  useParams } from "react-router"
import SagaDetailsView from "../view/saga-details.view"
import { onePieceSagas } from "@/pages/home/utils/saga.utils"
import { useMemo } from "react"
import useNavigation from "@/hooks/use-navigation/use-navigation"

const SagaDetailsController = () => {
  const { sagaId } = useParams()
  const { handleBack } = useNavigation()

  const currentSagaData = useMemo(
    () => onePieceSagas.find((saga) => saga.id === sagaId),
    [sagaId]
  )

  return <SagaDetailsView data={currentSagaData} handleClickBack={handleBack} />
}

export default SagaDetailsController
