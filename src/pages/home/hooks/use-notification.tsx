import useNotify, { type notificationData } from "@/hooks/use-notify/use-notify"
import { StorageKeys } from "@/utils/enum/storage-keys.utils"
import {
  filterActiveNotifications,
  getNotificationId,
} from "@/utils/notification.utils"
import { useCallback, useMemo, useState } from "react"
import type { OpDataResponse } from "./use-op-data"

const readClosedNotificationIds = (): string[] => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const stored = sessionStorage.getItem(StorageKeys.CLOSED_NOTIFICATIONS)
    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item) => typeof item === "string")
  } catch {
    return []
  }
}

const useNotification = ({ data }: { data: OpDataResponse | undefined }) => {
  const { data: notificationData } = useNotify({ data })
  const [closedNotifications, setClosedNotifications] = useState<string[]>(
    readClosedNotificationIds
  )

  const handleCloseNotification = useCallback(
    (notification: notificationData) => {
      const notificationId = getNotificationId(notification)

      setClosedNotifications((prevState) => {
        if (prevState.includes(notificationId)) {
          return prevState
        }

        const nextState = [...prevState, notificationId]
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(
              StorageKeys.CLOSED_NOTIFICATIONS,
              JSON.stringify(nextState)
            )
          } catch {
            // Ignore sessionStorage errors so the UI can still update.
          }
        }
        return nextState
      })
    },
    []
  )

  const activeNotifications = useMemo(() => {
    if (!notificationData?.notifications) {
      return undefined
    }

    const active = filterActiveNotifications(notificationData.notifications)
    if (!closedNotifications.length) {
      return {
        ...notificationData,
        notifications: active,
      }
    }

    const closedSet = new Set(closedNotifications)
    return {
      ...notificationData,
      notifications: active.filter(
        (notification) => !closedSet.has(getNotificationId(notification))
      ),
    }
  }, [notificationData, closedNotifications])

  return {
    activeNotifications,
    handleCloseNotification,
  }
}

export default useNotification
