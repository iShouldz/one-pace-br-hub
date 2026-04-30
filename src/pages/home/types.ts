import type { ResolvedTheme } from "@/components/theme-provider"
import type { OpDataResponse } from "./hooks/use-op-data"
import type { NotificationResponse } from "@/hooks/use-notify/use-notify"
import type { ConfigContentKey } from "@/components/config-menu/settings-dialog"

export type IArc = {
  id: string
  title: string
  imagePath?: string
  description: string
  linkDownload: string
  hideSubtitle?: boolean
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
  isLoading: boolean
  showAllSagas: boolean
  openSettings: boolean
  hideGrayscale: boolean
  currentTheme: ResolvedTheme
  handleToggleTheme: () => void
  handleHideGrayscale: () => void
  handleRedirectToForm: () => void
  handleToggleSettings: () => void
  handleOpenSettingsMenu: () => void
  handleToggleOrderList: () => void
  renderModalOnePaceWelcome: boolean
  handleCloseWelcomeModal: () => void
  handleHideCompletedSagas: () => void
  handleRedirectToIssuesGithub: () => void
  handleRedirectToSubtitleRepo: () => void
  onePieceSagas: OpDataResponse | undefined
  defaultOptionOpenConfig: ConfigContentKey
  handleTriggerStremioAddonHeader: () => void
  handleCloseNotification: (
    notification: NotificationResponse["notifications"][number]
  ) => void
  handleRedirectNotifyButton: (path: string) => void
  notificationData: NotificationResponse | undefined
  handleRedirectToSagaDetails: (sagaId: string) => void
  handleRedirectToArcDetails: (sagaId: string, arcId: string) => void
}

export interface ISagaList {
  showAllSagas: boolean
  onePieceSagas: OpDataResponse | undefined
  handleRedirectToSagaDetails: (sagaId: string) => void
  handleRedirectToArcDetails: (sagaId: string, arcId: string) => void
}
