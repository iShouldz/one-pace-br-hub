import useNotify from "@/hooks/use-notify/use-notify"
import { filterActiveNotifications } from "@/utils/notification.utils"
import { useMemo } from "react"

const useNotification = () => {
  const { data: notificationData } = useNotify()

  const activeNotifications = useMemo(() => {
    if (!notificationData?.notifications) {
      return undefined
    }

    return {
      ...notificationData,
      notifications: filterActiveNotifications(notificationData.notifications),
    }
  }, [notificationData])

  return { activeNotifications }
}

export default useNotification
