import type { IArc } from "@/pages/home/types"

export interface ICarouselArc {
  arcs: IArc[]
  sagaId: string
  handleRedirectToArcDetails: (sagaId: string, arcId: string) => void
}
