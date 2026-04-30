import type { notificationData } from "@/hooks/use-notify/use-notify"

export const getNotificationId = (notification: notificationData): string => {
  return `${notification.notifyCreatedAt}-${notification.title}`
}

const SECONDS_PER_DAY = 86400

export const isNotificationActive = (
  notification: notificationData
): boolean => {
  const nowInSeconds = Math.floor(Date.now() / 1000)
  const daysSinceCreation =
    (nowInSeconds - notification.notifyCreatedAt) / SECONDS_PER_DAY

  return daysSinceCreation < notification.notifyRunnedByDays
}

export const filterActiveNotifications = (
  notifications: notificationData[]
): notificationData[] => {
  return notifications.filter(isNotificationActive)
}
