import type { ISaga } from "../home/types"

export interface ISagaDetailsView {
  sagaId: string
  data?: ISaga | undefined
  handleClickBack: () => void
  handleRedirectToHome: () => void
  handleRedirectToArcDetails: (sagaId: string, arcId: string) => void
}
