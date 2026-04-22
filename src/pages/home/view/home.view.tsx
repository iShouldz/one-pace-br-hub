import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import SagaList from "../components/SagaList/saga-list.component"
import type { IHomeView } from "../types"
import {
  Captions,
  InfoIcon,
  SettingsIcon,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import { Button } from "@/components/ui/button"
import { SettingsDialog } from "@/components/config-menu/settings-dialog"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
const HomeView = ({
  openSettings,
  showAllSagas,
  onePieceSagas,
  handleHideGrayscale,
  handleToggleSettings,
  handleToggleOrderList,
  handleHideCompletedSagas,
  handleRedirectToArcDetails,
  handleRedirectToSagaDetails,
  handleRedirectToSubtitleRepo,
}: IHomeView) => {
  return (
    <BackgroundHeaderComponent>
      <Dialog open={false}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="flex flex-col gap-6 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bem vindo ao One Pace BR</DialogTitle>
            <DialogDescription className="flex flex-col gap-4">
              Esse projeto é um agregador de legendas para o projeto One Pace. O
              projeto possui legendas hospedadas no Github, com repositorio
              abaixo. Você pode colaborar com as legendas, caso as ultimas
              legendas dos episodios mais recentes não estejam disponiveis, ou
              mesmo corrigir alguma legenda que esteja com erro. Para isso,
              basta acessar o repositorio e seguir as instruções do README para
              contribuir.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Item variant="muted">
              <ItemMedia variant="icon">
                <InfoIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Sobre o One Pace</ItemTitle>
                <ItemDescription className="wrap-break-words text-ellipsis-none! overflow-visible! text-wrap! whitespace-pre-line">
                  Esse hub é apenas um agregador para legendas pt-br, apenas
                  facilitamos o acesso às legendas criadas pela comunidade.
                  Todos os creditos para o One Pace
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" variant="outline" onClick={() => {}}>
                  Visitar o site
                </Button>
              </ItemActions>
            </Item>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <main className="relative z-10">
        <SettingsDialog
          openSettings={openSettings}
          handleHideGrayscale={handleHideGrayscale}
          handleToggleSettings={handleToggleSettings}
          handleToggleOrderList={handleToggleOrderList}
          handleHideCompletedSagas={handleHideCompletedSagas}
        />
        <header className="m-4 flex justify-end">
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
              <TooltipContent side="right">
                Repositorio das legendas
              </TooltipContent>
            </Tooltip>
          </ButtonGroup>
        </header>
        <section className="pointer-events-none absolute inset-x-0 top-0 flex h-[50svh] items-center">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="flex justify-center">
              <img
                src="/one-pace-logo.png"
                alt="One Pace Logo"
                loading="lazy"
                className="w-64 max-w-full object-contain sm:w-90 md:w-125"
              />
            </div>
          </div>
        </section>

        <section className="md:pt-[35svh] lg:pt-[45svh]">
          <SagaList
            showAllSagas={showAllSagas}
            onePieceSagas={onePieceSagas}
            handleRedirectToArcDetails={handleRedirectToArcDetails}
            handleRedirectToSagaDetails={handleRedirectToSagaDetails}
          />
        </section>
      </main>
    </BackgroundHeaderComponent>
  )
}

export default HomeView
