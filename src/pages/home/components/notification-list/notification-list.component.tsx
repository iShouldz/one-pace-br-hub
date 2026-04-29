import type { INotificationListComponentProps } from "../types"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ArrowUpRight, InfoIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const NotificationListComponent = ({
  notificationData,
  closedNotifications,
  handleRedirectNotifyButton,
  handleToggleCloseNotifications,
}: INotificationListComponentProps) => {
  return (
    <div className="flex w-full justify-center">
      {notificationData &&
        closedNotifications &&
        notificationData.notifications.map((notification) => (
          <Alert
            className="relative z-20 m-2 flex w-300 items-center justify-center"
            key={notification.title}
          >
            <InfoIcon />
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription className="flex items-center justify-center">
              {notification.description}{" "}
            </AlertDescription>
            <Button
              variant="ghost"
              onClick={() => handleRedirectNotifyButton(notification.buttonUrl)}
            >
              {notification.buttonText} <ArrowUpRight />
            </Button>
            <AlertAction>
              <Button variant="ghost" onClick={handleToggleCloseNotifications}>
                <X />
              </Button>
            </AlertAction>
          </Alert>
        ))}
    </div>
  )
}

export default NotificationListComponent
