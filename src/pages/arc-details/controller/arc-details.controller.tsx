import useNavigation from "@/hooks/use-navigation/use-navigation"
import { onePieceSagas } from "@/pages/home/utils/saga.utils"
import { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router"
import ArcDetailsView from "../view/arc-details.view"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import { StorageKeys } from "@/utils/storage-keys.utils"
import { RoutesUrl } from "@/utils/enum/routes.utils"
import type { IOnePaceArc } from "../types"
import useTorrent from "../hooks/use-torrent"

const ArcDetailsController = () => {
  const { sagaId, arcId } = useParams()
  const { handleRedirect, handleBack } = useNavigation()
  const [magnetLinks, setMagnetLinks] = useState<string[]>([])
  const { extractMagnetLinks, fetchPageContent, tryCopyMagnetsToClipboard } =
    useTorrent()

  const currentArcData = useMemo(
    () =>
      onePieceSagas
        .find((saga) => saga.id === sagaId)
        ?.arcs.find((arc) => arc.id === arcId),
    [sagaId, arcId]
  )

  const handleDownloadEpisodes = useCallback(async () => {
    let completedArcs: IOnePaceArc[] =
      getFromLocalStorage(StorageKeys.COMPLETED_ONE_PACE) || []

    const arcData = onePieceSagas
      .find((saga) => saga.id === sagaId)
      ?.arcs.find((arc) => arc.id === arcId)

    const sagaIndex = completedArcs.findIndex((saga) => saga.id === sagaId)

    if (sagaIndex === -1) {
      completedArcs.push({
        id: sagaId!,
        arcos: [arcId!],
      } as any)
    } else {
      const sagaObj = completedArcs[sagaIndex]
      if (!sagaObj.arcos.includes(arcId!)) {
        sagaObj.arcos.push(arcId!)
      }
    }

    saveToLocalStorage(StorageKeys.COMPLETED_ONE_PACE, completedArcs)
    window.dispatchEvent(new Event("completed-one-pace-updated"))

    if (arcData?.scrapping) {
      let linksToOpen = magnetLinks

      try {
        if (!linksToOpen.length) {
          const html = await fetchPageContent(arcData.linkDownload)
          linksToOpen = extractMagnetLinks(html)
          setMagnetLinks(linksToOpen)
        }
        return linksToOpen
      } catch (error) {
        console.error("Erro ao buscar/extrair magnet links:", error)
        return []
      }
    } else if (arcData?.linkDownload) {
      handleRedirect(arcData.linkDownload, { external: true })
      return []
    }

    return []
  }, [
    arcId,
    sagaId,
    magnetLinks,
    handleRedirect,
    fetchPageContent,
    extractMagnetLinks,
  ])

  const handleCopyMagnetLinks = useCallback(
    async (links: string[]) => {
      return tryCopyMagnetsToClipboard(links)
    },
    [tryCopyMagnetsToClipboard]
  )

  const handleDownloadSubtitles = useCallback(() => {
    const currentArcSubtitle = `https://downgit.github.io/#/home?url=https://github.com/iShouldz/one-pace-br-hub-legendas/tree/main/sagas/${sagaId}/${arcId}`
    handleRedirect(currentArcSubtitle)
  }, [sagaId, arcId])

  const handleRedirectToHome = useCallback(() => {
    handleRedirect(RoutesUrl.HOME)
  }, [handleRedirect])

  const handleRedirectToSagaList = useCallback(() => {
    handleRedirect(RoutesUrl.SAGA_DETAILS.replace(":sagaId", sagaId!))
  }, [handleRedirect, sagaId])

  const handleRedirectButtonAction = useCallback(
    (path?: string) => {
      if (!path) return
      handleRedirect(path)
    },
    [handleRedirect]
  )

  return (
    <ArcDetailsView
      arcId={arcId}
      sagaId={sagaId}
      data={currentArcData}
      handleBack={handleBack}
      magnetLinks={magnetLinks}
      handleRedirectToHome={handleRedirectToHome}
      handleDownloadEpisodes={handleDownloadEpisodes}
      handleCopyMagnetLinks={handleCopyMagnetLinks}
      handleDownloadSubtitles={handleDownloadSubtitles}
      handleRedirectToSagaList={handleRedirectToSagaList}
      handleRedirectButtonAction={handleRedirectButtonAction}
    />
  )
}

export default ArcDetailsController
