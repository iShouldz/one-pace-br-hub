import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { InfoIcon } from "lucide-react"
import type { IInformationsListComponentProps } from "../types"

const InformationListComponent = ({
  informations,
  handleRedirectButtonAction,
}: IInformationsListComponentProps) => {
  return (
    <div>
      {informations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Informacoes uteis
          </h4>
          <div className="flex max-h-75 flex-col gap-3 overflow-y-auto pr-1">
            {informations.map((info) => (
              <Item variant="muted" key={info.title}>
                <ItemMedia variant="icon">
                  <InfoIcon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{info.title}</ItemTitle>
                  <ItemDescription className="wrap-break-words text-ellipsis-none! overflow-visible! text-wrap! whitespace-pre-line text-accent-foreground">
                    {info.description}
                  </ItemDescription>
                </ItemContent>
                {info.buttonText && (
                  <ItemActions>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleRedirectButtonAction(info.actionButton)
                      }
                    >
                      {info.buttonText}
                    </Button>
                  </ItemActions>
                )}
              </Item>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default InformationListComponent
