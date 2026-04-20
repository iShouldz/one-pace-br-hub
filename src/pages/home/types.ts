export type IArc = {
  id: string
  title: string
  imagePath?: string
  description: string
}

export type ISaga = {
  id: string
  arcs: IArc[]
  title: string
  sagaId: string;
  description: string
  handleRedirectToSagaDetails: (sagaId: string) => void
}

export interface IHomeView {
  data?: ISaga[]
  handleRedirectToSagaDetails: (sagaId: string) => void
}

export interface ISagaList {
  handleRedirectToSagaDetails: (sagaId: string) => void
}
