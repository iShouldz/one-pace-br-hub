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
import { useAutoAnimate } from "@formkit/auto-animate/react"

const NotificationListComponent = ({
  notificationData,
  handleCloseNotification,
  handleRedirectNotifyButton,
}: INotificationListComponentProps) => {
  const [listRef] = useAutoAnimate()

  if (!notificationData?.notifications?.length) {
    return null
  }

  const totalNotifications = notificationData.notifications.length

  return (
    <div className="flex w-full justify-center pt-4">
      <div
        ref={listRef}
        className="flex w-full max-w-md flex-col items-center"
        style={{ perspective: "900px" }}
      >
        {notificationData.notifications.map((notification, index) => {
          const stackIndex = Math.min(index, 3)
          const opacity = 1 - stackIndex * 0.08
          const scale = 1 - stackIndex * 0.035
          const translateY = stackIndex * 6
          const rotateX = stackIndex * 2

          return (
            <Alert
              className={`relative flex min-h-14 w-300 items-center gap-3 overflow-hidden border border-white/50 bg-gradient-to-b from-white/90 via-white/80 to-white/70 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.45)] ring-1 ring-black/5 backdrop-blur-xl transition-[opacity,transform] duration-200 ease-out before:pointer-events-none before:absolute before:inset-x-2 before:top-0 before:h-px before:bg-white/70 dark:border-white/10 dark:from-neutral-950/80 dark:via-neutral-900/70 dark:to-neutral-900/60 dark:ring-white/10 dark:before:bg-white/10 ${
                index > 0 ? "-mt-12" : ""
              }`}
              key={getNotificationId(notification)}
              style={{
                zIndex: totalNotifications - index,
                opacity,
                transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
            >
              <AlertTitle className="flex max-w-[40%] min-w-0 items-center gap-2 truncate">
                <InfoIcon className="size-5 shrink-0" />
                {notification.title}
              </AlertTitle>
              <AlertDescription className="flex max-w-[87%] min-w-0 items-center gap-2">
                <span className="min-w-0 truncate">
                  {notification.description}
                </span>
              </AlertDescription>

              <AlertAction className="flex items-center">
                {notification?.buttonText && (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleRedirectNotifyButton(notification?.buttonUrl)
                    }
                  >
                    {notification.buttonText} <ArrowUpRight />
                  </Button>
                )}
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
