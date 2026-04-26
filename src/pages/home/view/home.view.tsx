import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import SagaList from "../components/SagaList/saga-list.component"
import SagaListLoading from "../components/SagaList/saga-list-loading.component"
import type { IHomeView } from "../types"
import { Captions, SettingsIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { SettingsDialog } from "@/components/config-menu/settings-dialog"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field"

const HomeView = ({
  isLoading,
  currentTheme,
  openSettings,
  showAllSagas,
  hideGrayscale,
  onePieceSagas,
  handleToggleTheme,
  handleHideGrayscale,
  handleToggleSettings,
  handleToggleOrderList,
  handleCloseWelcomeModal,
  handleHideCompletedSagas,
  renderModalOnePaceWelcome,
  handleRedirectToArcDetails,
  handleRedirectToSagaDetails,
  handleRedirectToSubtitleRepo,
}: IHomeView) => {
  return (
    <BackgroundHeaderComponent>
      <Dialog
        open={renderModalOnePaceWelcome}
        onOpenChange={handleCloseWelcomeModal}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="flex flex-col gap-6 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <img
                src="images/one-pace-logo.webp"
                alt="One Pace Logo"
                loading="lazy"
                className="w-200 object-contain"
              />
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-4">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>O que é o One Pace?</FieldTitle>
                  <FieldDescription>
                    One Pace é um projeto de fãs que reedita o anime One Piece
                    para ficar mais alinhado ao ritmo do mangá original de
                    Eiichiro Oda. A equipe realiza isso removendo cenas de
                    filler não presentes no material original, corrigindo erros
                    de animação e ajustando legendas
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>O que é o One Pace BR Hub?</FieldTitle>
                  <FieldDescription>
                    Esse projeto é um agregador de legendas para o projeto One
                    Pace. O projeto possui legendas hospedadas no Github, com
                    repositorio abaixo. Você pode colaborar com as legendas,
                    caso as ultimas legendas dos episodios mais recentes não
                    estejam disponiveis, ou mesmo corrigir alguma legenda que
                    esteja com erro. Para isso, basta acessar o repositorio e
                    seguir as instruções do README para contribuir.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <main className="relative z-10">
        <SettingsDialog
          currentTheme={currentTheme}
          openSettings={openSettings}
          hideGrayscale={hideGrayscale}
          handleToggleTheme={handleToggleTheme}
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
                src="images/one-pace-logo.webp"
                alt="One Pace Logo"
                loading="lazy"
                className="w-200 object-contain"
              />
            </div>
          </div>
        </section>

        {isLoading ? (
          <SagaListLoading />
        ) : (
          <section className="md:pt-[35svh] lg:pt-[45svh]">
            <SagaList
              showAllSagas={showAllSagas}
              onePieceSagas={onePieceSagas}
              handleRedirectToArcDetails={handleRedirectToArcDetails}
              handleRedirectToSagaDetails={handleRedirectToSagaDetails}
            />
          </section>
        )}
      </main>
    </BackgroundHeaderComponent>
  )
}

export default HomeView
