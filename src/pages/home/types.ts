export type IArc = {
  id: string
  title: string
  imagePath?: string
  description: string
  linkDownload: string
  scrapping?: boolean
  informations?: IInformationProps[]
}

export interface IInformationProps {
  title: string
  description: string
  buttonText?: string
  actionButton?: string
}

export type ISaga = {
  id: string
  arcs: IArc[]
  title: string
  sagaId?: string
  description: string

  handleRedirectToSagaDetails?: (sagaId: string) => void
}

export interface IHomeView {
  showAllSagas: boolean
  onePieceSagas: ISaga[]
  handleToggleOrderList: () => void
  handleHideCompletedSagas: () => void
  handleRedirectToSagaDetails: (sagaId: string) => void
  handleRedirectToArcDetails: (sagaId: string, arcId: string) => void
}

export interface ISagaList {
  showAllSagas: boolean
  onePieceSagas: ISaga[]
  handleRedirectToSagaDetails: (sagaId: string) => void
  handleRedirectToArcDetails: (sagaId: string, arcId: string) => void
}
