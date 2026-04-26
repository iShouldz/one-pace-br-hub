import useNavigation from "@/hooks/use-navigation/use-navigation"
import { onePieceSagas } from "@/pages/home/utils/saga.utils"
import { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router"
import ArcDetailsView from "../view/arc-details.view"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import { StorageKeys } from "@/utils/enum/storage-keys.utils"
import { RoutesUrl } from "@/utils/enum/routes.utils"
import type { IOnePaceArc, IQbittorrentClientConfig } from "../types"
import useTorrent from "../hooks/use-torrent"
import { toast } from "sonner"

const ArcDetailsController = () => {
  const {
    fetchPageContent,
    extractMagnetLinks,
    getCachedLinksForArc,
    sendMagnetsToQbittorrent,
    tryCopyMagnetsToClipboard,
  } = useTorrent()
  const { sagaId, arcId } = useParams()
  const { handleRedirect, handleBack } = useNavigation()
  const [magnetLinks, setMagnetLinks] = useState<string[]>([])

  const currentArcData = useMemo(
    () =>
      onePieceSagas
        .find((saga) => saga.id === sagaId)
        ?.arcs.find((arc) => arc.id === arcId),
    [sagaId, arcId]
  )

  const qbittorrentConfig = useMemo(
    () =>
      getFromLocalStorage(
        StorageKeys.QBITTORRENT_CONFIG
      ) as IQbittorrentClientConfig | null,
    []
  )

  const handleCopyMagnetLinksClick = async () => {
    const copied = await handleCopyMagnetLinks(magnetLinks)
    if (magnetLinks.length === 1) {
      return handleRedirect(magnetLinks[0], { external: true })
    }
    if (!copied) {
      toast("Não foi possível copiar automaticamente", {
        description:
          "Copie manualmente os links abaixo e cole no seu cliente torrent.",
      })
    }
  }

  const handleDownloadEpisodes = useCallback(async () => {
    const completedArcs: IOnePaceArc[] =
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

    let linksToOpen = magnetLinks

    try {
      if (!linksToOpen.length) {
        const cachedLinks = await getCachedLinksForArc(arcId)
        if (cachedLinks.length) {
          linksToOpen = cachedLinks
          setMagnetLinks(linksToOpen)
          return linksToOpen
        }

        const html = await fetchPageContent(arcData!.linkDownload)
        linksToOpen = extractMagnetLinks(html)
        setMagnetLinks(linksToOpen)
      }

      return linksToOpen
    } catch (error) {
      console.error("Erro ao buscar/extrair magnet links:", error)
      return []
    }
  }, [
    arcId,
    sagaId,
    magnetLinks,
    fetchPageContent,
    extractMagnetLinks,
    getCachedLinksForArc,
  ])

  const handleSendToQbittorrent = useCallback(async () => {
    if (qbittorrentConfig) {
      await sendMagnetsToQbittorrent({
        links: magnetLinks,
        config: {
          ...qbittorrentConfig,
          savePath: `${qbittorrentConfig.savePath}/${sagaId}/${arcId}`,
        },
      })
    }
  }, [magnetLinks, sagaId, arcId, qbittorrentConfig, sendMagnetsToQbittorrent])

  const handleCopyMagnetLinks = useCallback(
    async (links: string[]) => {
      return tryCopyMagnetsToClipboard(links)
    },
    [tryCopyMagnetsToClipboard]
  )

  const handleDownloadSubtitles = useCallback(() => {
    const currentArcSubtitle = `https://downgit.github.io/#/home?url=https://github.com/iShouldz/one-pace-br-hub-legendas/tree/main/sagas/${sagaId}/${arcId}`
    handleRedirect(currentArcSubtitle)
  }, [handleRedirect, sagaId, arcId])

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
      qbittorrentConfig={qbittorrentConfig}
      handleRedirectToHome={handleRedirectToHome}
      handleCopyMagnetLinks={handleCopyMagnetLinks}
      handleDownloadEpisodes={handleDownloadEpisodes}
      handleSendToQbittorrent={handleSendToQbittorrent}
      handleDownloadSubtitles={handleDownloadSubtitles}
      handleRedirectToSagaList={handleRedirectToSagaList}
      handleCopyMagnetLinksClick={handleCopyMagnetLinksClick}
      handleRedirectButtonAction={handleRedirectButtonAction}
    />
  )
}

export default ArcDetailsController
