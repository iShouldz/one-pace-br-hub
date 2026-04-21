import type { IArc } from "../home/types"

export interface IArcDetailsView {
  arcId?: string
  sagaId?: string
  handleBack: () => void
  data: IArc | undefined
  handleRedirectToHome: () => void
  handleDownloadEpisodes: () => void
  handleDownloadSubtitles: () => void
  handleRedirectToSagaList: () => void
  handleRedirectButtonAction: (path?: string) => void
}

export interface IOnePaceArc {
  id: string
  arcos: string[]
}
