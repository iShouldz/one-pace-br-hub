import type { IArc } from "../home/types"

export interface IArcDetailsView {
  arcId?: string
  sagaId?: string
  magnetLinks: string[]
  data: IArc | undefined
  handleRedirectToHome: () => void
  handleDownloadSubtitles: () => void
  handleRedirectToSagaList: () => void
  handleSendToQbittorrent: () => Promise<void>
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
