import { useParams } from "react-router"
import SagaDetailsView from "../view/saga-details.view"
import { onePieceSagas } from "@/pages/home/utils/saga.utils"

const SagaDetailsController = () => {
  const { sagaId } = useParams()
  const currentSagaData = onePieceSagas.find((saga) => saga.id === sagaId) 
  return <SagaDetailsView data={currentSagaData} />
}

export default SagaDetailsController
