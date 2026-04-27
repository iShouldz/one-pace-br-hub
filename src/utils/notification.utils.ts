export interface INotification {
  title: string
  description: string
  type: string
  notifyCreatedAt: number
  notifyRunnedByDays: number
  buttonText: string
  buttonUrl: string
}

const SECONDS_PER_DAY = 86400

export const isNotificationActive = (notification: INotification): boolean => {
  const nowInSeconds = Math.floor(Date.now() / 1000)
  const daysSinceCreation =
    (nowInSeconds - notification.notifyCreatedAt) / SECONDS_PER_DAY

  return daysSinceCreation < notification.notifyRunnedByDays
}

export const filterActiveNotifications = (
  notifications: INotification[]
): INotification[] => {
  return notifications.filter(isNotificationActive)
}
