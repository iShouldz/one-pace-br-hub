import useNavigation from "@/hooks/use-navigation/use-navigation"
import { onePieceSagas } from "@/pages/home/utils/saga.utils"
import { useCallback, useMemo } from "react"
import { useParams } from "react-router"
import ArcDetailsView from "../view/arc-details.view"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import { StorageKeys } from "@/utils/storage-keys.utils"

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

  const handleDownloadEpisodes = useCallback(() => {
    const completedArcs = getFromLocalStorage(StorageKeys.COMPLETED_ARCS) || []
    if (!arcId || completedArcs.includes(arcId)) {
      return
    }

    saveToLocalStorage(StorageKeys.COMPLETED_ARCS, [...completedArcs, arcId])
  }, [arcId])

  const handleDownloadSubtitles = useCallback(() => {}, [])

  return (
    <ArcDetailsView
      data={currentArcData}
      handleBack={handleBack}
      handleDownloadEpisodes={handleDownloadEpisodes}
      handleDownloadSubtitles={handleDownloadSubtitles}
    />
  )
}

export default ArcDetailsController
