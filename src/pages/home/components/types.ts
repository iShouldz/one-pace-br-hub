import type { IArc } from "../types"

export interface IArcBlockComponent {
  id: string
  arcs: IArc[]
  title: string
  sagaId: string
  description: string
  handleRedirectToSagaDetails: (sagaId: string) => void
  handleRedirectToArcDetails: (sagaId: string, arcId: string) => void
}
