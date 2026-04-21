import type { ISaga } from "../home/types"

export interface ISagaDetailsView {
  data?: ISaga
  sagaId: string
  handleClickBack: () => void
  handleRedirectToArcDetails: (sagaId: string, arcId: string) => void
}
