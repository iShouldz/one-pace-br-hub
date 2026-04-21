import type { IArc } from "../home/types"

export interface IArcDetailsView {
  handleBack: () => void
  data: IArc | undefined
  handleDownloadEpisodes: () => void
  handleDownloadSubtitles: () => void
}
