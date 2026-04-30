import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { useCallback } from "react"

const HeaderComponent = ({
  handleTriggerStremioAddonHeader,
}: {
  handleTriggerStremioAddonHeader: () => void
}) => {
  const { handleRedirect } = useNavigation()

  const handleRedirectToStremioAddon = useCallback(() => {
    handleTriggerStremioAddonHeader()
  }, [handleTriggerStremioAddonHeader])

  const handleRedirectToOnePace = useCallback(() => {
    handleRedirect("https://onepace.net/en")
  }, [handleRedirect])

  const handleRedirectToSubtitleRepo = useCallback(() => {
    handleRedirect("https://github.com/iShouldz/one-pace-br-hub-legendas")
  }, [handleRedirect])

  return (
    <header className="fixed top-6 right-6 z-50 flex items-center gap-1 rounded-full border border-border/40 bg-background/50 p-1 text-muted-foreground/80 opacity-80 backdrop-blur-md transition-opacity hover:opacity-100">
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRedirectToStremioAddon}
            aria-label="stremio"
            className="hover:text-foreground"
          >
            <img
              src="/images/icons/stremio.webp"
              alt=""
              className="size-5 opacity-80"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Addon PT BR - Stremio</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRedirectToSubtitleRepo}
            aria-label="github"
            className="hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Repositorio das legendas</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            aria-label="reddit"
            className="hover:text-foreground"
            onClick={handleRedirectToOnePace}
          >
            <img
              src="/images/icons/chapeu-de-palha.webp"
              alt=""
              className="size-5 opacity-80"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>One Pace</p>
        </TooltipContent>
      </Tooltip>
    </header>
  )
}

export default HeaderComponent
