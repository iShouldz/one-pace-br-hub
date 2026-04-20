import { useNavigate, useParams } from "react-router"
import SagaDetailsView from "../view/saga-details.view"
import { onePieceSagas } from "@/pages/home/utils/saga.utils"
import { useMemo } from "react"

const SagaDetailsController = () => {
  const { sagaId } = useParams()
  const navigate = useNavigate()

  const currentSagaData = useMemo(
    () => onePieceSagas.find((saga) => saga.id === sagaId),
    [sagaId]
  )
  console.log(currentSagaData)
  const handleBack = () => {
    console.log("back")
    navigate(-1)
  }

  return <SagaDetailsView data={currentSagaData} handleClickBack={handleBack} />
}

export default SagaDetailsController
