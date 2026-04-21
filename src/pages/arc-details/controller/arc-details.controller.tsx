import useNavigation from "@/hooks/use-navigation/use-navigation"
import { onePieceSagas } from "@/pages/home/utils/saga.utils"
import { useCallback, useMemo } from "react"
import { useParams } from "react-router"
import ArcDetailsView from "../view/arc-details.view"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import { StorageKeys } from "@/utils/storage-keys.utils"
import { RoutesUrl } from "@/utils/enum/routes.utils"
import type { IOnePaceArc } from "../types"

const ArcDetailsController = () => {
  const { sagaId, arcId } = useParams()
  const { handleBack, handleRedirect } = useNavigation()

  const currentArcData = useMemo(
    () =>
      onePieceSagas
        .find((saga) => saga.id === sagaId)
        ?.arcs.find((arc) => arc.id === arcId),
    [sagaId, arcId]
  )

  const handleDownloadEpisodes = useCallback(() => {
    let completedArcs: IOnePaceArc[] =
      getFromLocalStorage(StorageKeys.COMPLETED_ONE_PACE) || []

    const sagaIndex = completedArcs.findIndex((saga) => saga.id === sagaId)

    if (sagaIndex === -1) {
      completedArcs.push({
        id: sagaId!,
        arcos: [arcId!],
      })
    } else {
      const sagaObj = completedArcs[sagaIndex]
      if (!sagaObj.arcos.includes(arcId!)) {
        sagaObj.arcos.push(arcId!)
      }
    }

    saveToLocalStorage(StorageKeys.COMPLETED_ONE_PACE, completedArcs)
    window.dispatchEvent(new Event("completed-one-pace-updated"))
  }, [arcId, sagaId])

  const handleDownloadSubtitles = useCallback(() => {}, [])

  const handleRedirectToHome = useCallback(() => {
    handleRedirect(RoutesUrl.HOME)
  }, [])

  const handleRedirectToSagaList = useCallback(() => {
    handleRedirect(RoutesUrl.SAGA_DETAILS.replace(":sagaId", sagaId!))
  }, [sagaId])

  const handleRedirectButtonAction = useCallback(
    (path?: string) => {
      if (!path) return
      handleRedirect(path)
    },
    [handleRedirect]
  )

  return (
    <ArcDetailsView
      data={currentArcData}
      handleBack={handleBack}
      handleRedirectToHome={handleRedirectToHome}
      handleDownloadEpisodes={handleDownloadEpisodes}
      handleDownloadSubtitles={handleDownloadSubtitles}
      handleRedirectToSagaList={handleRedirectToSagaList}
      handleRedirectButtonAction={handleRedirectButtonAction}
    />
  )
}

export default ArcDetailsController
