import type { INotificationListComponentProps } from "../types"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ArrowUpRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotificationId } from "@/utils/notification.utils"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import IconBuilderComponent from "../icon-builder/icon-builder.component"

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
        className="max-w-9xl flex w-full flex-col items-center"
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
              key={getNotificationId(notification)}
              className={`relative flex min-h-14 w-full ${notification.type.includes("error") ? "border-red-500 bg-red-300!" : "border-white/50"} items-center justify-between gap-4 overflow-hidden bg-gradient-to-b from-white/90 via-white/80 to-white/70 p-4 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.45)] ring-1 ring-black/5 backdrop-blur-xl transition-[opacity,transform] duration-200 ease-out before:pointer-events-none before:absolute before:inset-x-2 before:top-0 before:h-px before:bg-white/70 md:w-170 lg:w-[70%] dark:border-white/10 dark:from-neutral-950/80 dark:via-neutral-900/70 dark:to-neutral-900/60 dark:ring-white/10 dark:before:bg-white/10 ${
                index > 0 ? "-mt-12" : ""
              }`}
              style={{
                zIndex: totalNotifications - index,
                opacity,
                transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="mr-2 flex min-w-0 flex-1 items-center gap-2">
                <AlertTitle className="mb-0 flex shrink-0 items-center gap-2 font-semibold">
                  <IconBuilderComponent type={notification.type} />
                  <span>{notification.title}</span>
                </AlertTitle>

                <AlertDescription className="mb-0 min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {notification.description}
                </AlertDescription>
              </div>

              <AlertAction className="ml-0 flex shrink-0 items-center gap-1">
                {notification?.buttonText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden items-center gap-1 text-xs font-medium lg:flex"
                    onClick={() =>
                      handleRedirectNotifyButton(notification?.buttonUrl)
                    }
                  >
                    {notification.buttonText}{" "}
                    <ArrowUpRight className="size-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleCloseNotification(notification)}
                >
                  <X className="size-4" />
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
