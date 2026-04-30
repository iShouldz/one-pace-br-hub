import type { INotificationListComponentProps } from "../types"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ArrowUpRight, InfoIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotificationId } from "@/utils/notification.utils"

const NotificationListComponent = ({
  notificationData,
  handleCloseNotification,
  handleRedirectNotifyButton,
}: INotificationListComponentProps) => {
  if (!notificationData?.notifications?.length) {
    return null
  }

  const totalNotifications = notificationData.notifications.length

  return (
    <div className="flex w-full justify-center pt-4">
      <div className="flex w-full max-w-md flex-col items-center">
        {notificationData.notifications.map((notification, index) => {
          const stackIndex = Math.min(index, 3)
          const opacity = 1 - stackIndex * 0.08
          const scale = 1 - stackIndex * 0.02

          return (
            <Alert
              className={`relative flex min-h-14 gap-3 w-300 origin-top items-center shadow-lg shadow-black/10 backdrop-blur-md transition-all ${
                index > 0 ? "-mt-12" : ""
              }`}
              key={getNotificationId(notification)}
              style={{
                zIndex: totalNotifications - index,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              <AlertTitle className="max-w-[40%] min-w-0 truncate flex items-center gap-2">
                <InfoIcon className="size-5 shrink-0" />
                {notification.title}
              </AlertTitle>
              <AlertDescription className="flex max-w-[87%] min-w-0 items-center gap-2">
                <span className="min-w-0 truncate">
                  {notification.description}
                </span>
              </AlertDescription>

              <AlertAction className="flex items-center ">
                <Button
                  variant="ghost"
                  onClick={() =>
                    handleRedirectNotifyButton(notification.buttonUrl)
                  }
                >
                  {notification.buttonText} <ArrowUpRight />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleCloseNotification(notification)}
                >
                  <X />
                </Button>
              </AlertAction>
            </Alert>
          )
        })}
      </div>
    </div>
  )
}

export default NotificationListComponent
