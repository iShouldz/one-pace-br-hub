import useNotify from "@/hooks/use-notify/use-notify"
import { StorageKeys } from "@/utils/enum/storage-keys.utils"
import { filterActiveNotifications } from "@/utils/notification.utils"
import { useCallback, useMemo, useState } from "react"

const useNotification = () => {
  const { data: notificationData } = useNotify()
  const [closedNotifications, setClosedNotifications] = useState<boolean>(
    sessionStorage.getItem(StorageKeys.CLOSED_NOTIFICATIONS) === "true"
  )

  const handleToggleCloseNotifications = useCallback(() => {
    setClosedNotifications((prevState) => {
      const newStatus = !prevState
      sessionStorage.setItem(
        StorageKeys.CLOSED_NOTIFICATIONS,
        String(newStatus)
      )
      return newStatus
    })
  }, [])

  const activeNotifications = useMemo(() => {
    if (!notificationData?.notifications) {
      return undefined
    }

    return {
      ...notificationData,
      notifications: filterActiveNotifications(notificationData.notifications),
    }
  }, [notificationData])

  return {
    activeNotifications,
    closedNotifications,
    handleToggleCloseNotifications,
  }
}

export default useNotification
