import useNotify, { type notificationData } from "@/hooks/use-notify/use-notify"
import { StorageKeys } from "@/utils/enum/storage-keys.utils"
import {
  filterActiveNotifications,
  getNotificationId,
} from "@/utils/notification.utils"
import { useCallback, useMemo, useState } from "react"
import type { OpDataResponse } from "./use-op-data"

type NotificationWithInstanceId = notificationData & { instanceId: string }

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
  const { data: notificationResponse } = useNotify({ data })
  const [closedNotifications, setClosedNotifications] = useState<string[]>(
    readClosedNotificationIds
  )

  const activeNotifications = useMemo(() => {
    if (!notificationResponse?.notifications) {
      return undefined
    }

    const active = filterActiveNotifications(notificationResponse.notifications)
    const closedSet = new Set(closedNotifications)
    const signatureCounts = new Map<string, number>()

    const notifications = active.reduce<NotificationWithInstanceId[]>(
      (accumulator, notification) => {
        const signature = getNotificationId(notification)
        const occurrence = signatureCounts.get(signature) ?? 0
        signatureCounts.set(signature, occurrence + 1)

        const instanceId = `${signature}:${occurrence}`
        if (closedSet.has(instanceId)) {
          return accumulator
        }

        accumulator.push({
          ...notification,
          instanceId,
        })

        return accumulator
      },
      []
    )

    return {
      ...notificationResponse,
      notifications,
    }
  }, [notificationResponse, closedNotifications])

  const handleCloseNotification = useCallback(
    (notification: notificationData) => {
      const notificationId = getNotificationId(notification)

      if (!notificationId || notificationId === "undefined") {
        console.error("Notificação sem ID válido:", notification)
        return
      }

      setClosedNotifications((prevState) => {
        if (prevState.includes(notificationId)) {
          return prevState
        }

        const nextState = [...prevState, notificationId]
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            StorageKeys.CLOSED_NOTIFICATIONS,
            JSON.stringify(nextState)
          )
        }
        return nextState
      })
    },
    []
  )

  return {
    activeNotifications,
    handleCloseNotification,
  }
}

export default useNotification
