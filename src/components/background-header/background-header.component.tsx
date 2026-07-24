import type { IBackgroundHeader } from "./types"
import {
  getLinearByDirection,
  getRadialByDirection,
} from "./utils/radial-linear-direction.utils"

import { useTheme } from "../theme-provider"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { Button } from "../ui/button"
import { ChevronLeft } from "lucide-react"

const BackgroundHeaderComponent = ({
  direction = "bottom",
  imageUrl = "/images/wallpaper-wano.webp",
  children,
}: IBackgroundHeader) => {
  const { theme } = useTheme()
  const { handleBack } = useNavigation()

  const effectiveTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  const resolvedImageUrl =
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("/")
      ? imageUrl
      : `/${imageUrl}`

  return (
    <div
      className={
        `relative isolate h-screen w-full overflow-x-hidden ` +
        (effectiveTheme === "dark"
          ? "bg-[#050918] text-white"
          : "bg-[#ebcead] text-black")
      }
    >
      <Button
        variant="ghost"
        onClick={handleBack}
        className="fixed top-5 left-3 z-50 bg-white/60 shadow-sm ring-1 ring-black/10 backdrop-blur-md dark:bg-black/40 dark:ring-white/10"
        aria-label="Abrir menu"
      >
        <ChevronLeft /> Voltar
      </Button>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-svh min-h-135 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{ backgroundImage: `url('${resolvedImageUrl}')` }}
        />

        <div
          className={
            effectiveTheme === "dark"
              ? "absolute inset-0 bg-black/35"
              : "absolute inset-0"
          }
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: getRadialByDirection(direction, effectiveTheme),
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: getLinearByDirection(direction, effectiveTheme),
          }}
        />
      </div>
      {children}
    </div>
  )
}

export default BackgroundHeaderComponent
