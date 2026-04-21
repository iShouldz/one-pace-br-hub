import type { IArc } from "../home/types"

export interface IArcDetailsView {
  arcId?: string
  sagaId?: string
  handleBack: () => void
  data: IArc | undefined
  handleRedirectToHome: () => void
  magnetLinks: string[]
  handleDownloadEpisodes: () => Promise<string[]>
  handleCopyMagnetLinks: (links: string[]) => Promise<boolean>
  handleDownloadSubtitles: () => void
  handleRedirectToSagaList: () => void
  handleRedirectButtonAction: (path?: string) => void
}

export interface IOnePaceArc {
  id: string
  arcos: string[]
}
