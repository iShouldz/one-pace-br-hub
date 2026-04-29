import type { IArc, IInformationProps } from "../home/types"

export interface IArcDetailsView {
  arcId?: string
  sagaId?: string
  magnetLinks: string[]
  data: IArc | undefined
  handleRedirectToHome: () => void
  handleDownloadSubtitles: () => void
  handleRedirectToSagaList: () => void
  handleSendToQbittorrent: () => Promise<void>
  handleTriggerDownload: (path?: string) => void
  handleDownloadEpisodes: () => Promise<string[]>
  handleCopyMagnetLinksClick: () => Promise<void>
  qbittorrentConfig: IQbittorrentClientConfig | null
  handleRedirectButtonAction: (path?: string) => void
  handleCopyMagnetLinks: (links: string[]) => Promise<boolean>
}

export interface IOnePaceArc {
  id: string
  arcos: string[]
}

export interface IQbittorrentClientConfig {
  baseUrl: string
  username: string
  password?: string
  savePath?: string
}

export interface IScrappingModalProps {
  magnetLinks: string[]
  isLoadingMagnets: boolean
  hasDriveDownload: boolean
  arcId: string | undefined
  sagaId: string | undefined
  manualDownloadLink?: string
  handleSendToQbittorrent: () => Promise<void>
  handleCopyMagnetLinksClick: () => Promise<void>
  qbittorrentConfig: IQbittorrentClientConfig | null
  handleDownloadEpisodesAndMarkDone: () => Promise<void>
  handleRedirectButtonAction: (path?: string | undefined) => void
}

export interface IInformationsListComponentProps {
  informations: IInformationProps[]
  handleRedirectButtonAction: (path?: string | undefined) => void
}
