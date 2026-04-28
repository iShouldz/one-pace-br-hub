import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Captions, SettingsIcon } from "lucide-react"
import type { IMenuSettingsComponentProps } from "../types"

const MenuSettingsComponent = ({
  handleToggleSettings,
  handleRedirectToSubtitleRepo,
}: IMenuSettingsComponentProps) => {
  return (
    <ButtonGroup
      orientation="vertical"
      aria-label="Media controls"
      className="h-fit"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="icon-lg"
            onClick={handleToggleSettings}
          >
            <SettingsIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Configurações</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="icon-lg"
            onClick={handleRedirectToSubtitleRepo}
          >
            <Captions />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Repositorio das legendas</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  )
}

export default MenuSettingsComponent
