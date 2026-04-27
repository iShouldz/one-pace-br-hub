import useNotify from "@/hooks/use-notify/use-notify"
import { filterActiveNotifications } from "@/utils/notification.utils"
import { useCallback, useMemo, useState } from "react"

const useNotification = () => {
  const { data: notificationData } = useNotify()
  const [closedNotifications, setClosedNotifications] = useState(true)

  const handleToggleCloseNotifications = useCallback(() => {
    setClosedNotifications((prevState) => !prevState)
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
