import type { NotificationResponse } from "@/hooks/use-notify/use-notify"
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

export interface IWelcomeModalComponentProps {
  renderModalOnePaceWelcome: boolean
  handleCloseWelcomeModal: () => void
}

export interface IMenuSettingsComponentProps {
  handleToggleSettings: () => void
  handleRedirectToSubtitleRepo: () => void
}

export interface INotificationListComponentProps {
  closedNotifications: boolean
  handleToggleCloseNotifications: () => void
  handleRedirectNotifyButton: (path: string) => void
  notificationData: NotificationResponse | undefined
}
