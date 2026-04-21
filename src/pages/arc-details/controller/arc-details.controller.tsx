import useNavigation from "@/hooks/use-navigation/use-navigation"
import { onePieceSagas } from "@/pages/home/utils/saga.utils"
import { useMemo } from "react"
import { useParams } from "react-router"
import ArcDetailsView from "../view/arc-details.view"

const ArcDetailsController = () => {
  const { sagaId, arcId } = useParams()
  const { handleBack } = useNavigation()

  const currentArcData = useMemo(
    () =>
      onePieceSagas
        .find((saga) => saga.id === sagaId)
        ?.arcs.find((arc) => arc.id === arcId),
    [sagaId, arcId]
  )

  return <ArcDetailsView data={currentArcData} handleBack={handleBack} />
}

export default ArcDetailsController
