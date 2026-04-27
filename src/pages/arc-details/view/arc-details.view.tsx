import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  CopyIcon,
  DownloadIcon,
  HomeIcon,
  InfoIcon,
  ListIcon,
  Search,
  Subtitles,
  WavesArrowDown,
} from "lucide-react"
import type { IArcDetailsView } from "../types"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

import { useState } from "react"
import type { IInformationProps } from "@/pages/home/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ButtonGroup } from "@/components/ui/button-group"
import { ArcStatsCard } from "../components/data-arc.component"
import { useOnePaceSheet } from "../hooks/use-one-pace-sheet"
import { Card } from "@/components/ui/card"
import { ArcStatsError } from "../components/data-arc-error.component"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { capitalizeWords } from "@/utils/capitalize.utils"

const ArcDetailsView = ({
  data,
  arcId,
  sagaId,
  magnetLinks,
  qbittorrentConfig,
  handleRedirectToHome,
  handleDownloadEpisodes,
  handleSendToQbittorrent,
  handleDownloadSubtitles,
  handleRedirectToSagaList,
  handleRedirectButtonAction,
  handleCopyMagnetLinksClick,
}: IArcDetailsView) => {
  const informations: IInformationProps[] = [
    ...(data?.informations ?? []),
    {
      title: "Sobre o One Pace",
      actionButton: "https://onepace.net/",
      buttonText: "Visitar o site",
      description:
        "Esse hub é apenas um agregador para legendas pt-br, apenas facilitamos o acesso às legendas criadas pela comunidade. Todos os creditos para o One Pace",
    },
  ]

  const [isLoadingMagnets, setIsLoadingMagnets] = useState(false)
  const { loading, error, getStatsForArc } = useOnePaceSheet()
  const statsDoArco = data?.title ? getStatsForArc(data.title) : null
  const hasDriveDownload = data?.linkDownload?.includes("drive") ?? false

  const handleDownloadEpisodesAndMarkDone = async () => {
    setIsLoadingMagnets(true)
    await handleDownloadEpisodes()
    setIsLoadingMagnets(false)
  }

  return (
    <BackgroundHeaderComponent direction="left">
      <main className="absolute inset-0 overflow-y-auto">
        <section className="mx-auto flex min-h-screen w-full max-w-360 flex-col gap-8 px-6 py-8 md:px-10 lg:px-16 lg:py-12">
          <article className="rounded-3xl border border-black/10 bg-white/55 p-5 shadow-xl shadow-black/10 backdrop-blur-md sm:p-7 dark:border-white/10 dark:bg-black/40 dark:shadow-black/40">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={handleRedirectToHome}
                    className="flex cursor-pointer items-center justify-center gap-2"
                  >
                    Página inicial
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={handleRedirectToSagaList}
                    className="flex cursor-pointer items-center justify-center gap-2"
                  >
                    {capitalizeWords(sagaId!?.replace(/-/g, " "))}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {capitalizeWords(arcId!?.replace(/-/g, " "))}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl lg:text-3xl">
                  {data?.title ?? "Arco nao encontrado"}
                </h2>
                <p className="text-base text-muted-foreground sm:text-lg">
                  {data?.description ??
                    "Nao encontramos os detalhes deste arco no momento."}
                </p>
              </div>
            </div>
          </article>

          <section className="grid min-h-[68svh] gap-6 pb-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <article className="flex flex-col gap-6 rounded-3xl border border-black/10 bg-white/45 p-5 shadow-xl shadow-black/10 backdrop-blur-md sm:p-6 md:p-7 dark:border-white/10 dark:bg-black/35 dark:shadow-black/40">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                  Baixar este arco
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Escolha o que deseja baixar. Ao baixar os episodios, marcamos
                  este arco automaticamente como concluido. As legendas sao
                  renomeadas para facilitar a identificacao, mas nao sao
                  embutidas nos episodios. Para servicos como o Jellyfin, as
                  legendas precisam ficar na mesma pasta dos episodios.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Dialog>
                  {!hasDriveDownload && (
                    <DialogTrigger asChild>
                      <Button size="lg">
                        <DownloadIcon /> Episodios
                      </Button>
                    </DialogTrigger>
                  )}

                  <DialogContent className="flex flex-col gap-6 sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Scrapping</DialogTitle>
                      <DialogDescription className="flex flex-col gap-4">
                        Esse arco provavelmente nao esta concluido ou nao foi
                        feito um bundle unico. Vamos fazer o scrapping dos
                        episodios para facilitar o download massivo dos
                        episodios para voce. Caso selecione o download multiplo,
                        adicionaremos ao seu clipboard os links torrents.
                        <Item variant="muted">
                          <ItemMedia variant="icon">
                            <InfoIcon />
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>O que e scrapping?</ItemTitle>
                            <ItemDescription className="wrap-break-words text-ellipsis-none! overflow-visible! text-wrap! whitespace-pre-line">
                              O scraping de site torrent e o processo
                              automatizado de extracao de dados (como titulos,
                              links magnet, tamanhos de arquivo e contagem de
                              seeds/peers) de plataformas de compartilhamento
                              P2P, como YTS, 1337x e Nyaa.si.
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <div className="flex w-full flex-col gap-4">
                        {magnetLinks.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground sm:text-sm">
                              Links encontrados. Voce pode copiar
                              automaticamente ou manualmente:
                            </p>
                            <textarea
                              className="min-h-32 w-full rounded-md border border-border/60 bg-background/70 p-2 text-xs text-foreground sm:p-3 sm:text-sm"
                              readOnly
                              value={magnetLinks.join("\n")}
                            />
                            {qbittorrentConfig?.savePath && (
                              <p className="text-xs text-muted-foreground sm:text-sm">
                                Caminho de salvamento do Qbittorrent:{" "}
                                {qbittorrentConfig?.savePath}\{sagaId}\{arcId}
                              </p>
                            )}
                          </div>
                        )}
                        <ButtonGroup>
                          {!hasDriveDownload && (
                            <>
                              <Button
                                type="button"
                                onClick={handleDownloadEpisodesAndMarkDone}
                                disabled={isLoadingMagnets}
                              >
                                <Search />
                                {isLoadingMagnets
                                  ? "Buscando links..."
                                  : "Buscar links"}
                              </Button>
                              <Button
                                type="button"
                                onClick={handleCopyMagnetLinksClick}
                                disabled={!magnetLinks.length}
                              >
                                <CopyIcon />
                                Copiar links
                              </Button>
                              {qbittorrentConfig?.baseUrl !== "" &&
                                qbittorrentConfig?.baseUrl !== undefined && (
                                  <Button
                                    type="button"
                                    onClick={handleSendToQbittorrent}
                                    disabled={!magnetLinks.length}
                                  >
                                    <WavesArrowDown />
                                    Enviar para qBittorrent
                                  </Button>
                                )}
                            </>
                          )}

                          <Button
                            type="button"
                            disabled={!data?.linkDownload}
                            onClick={() =>
                              handleRedirectButtonAction(data?.linkDownload)
                            }
                          >
                            <ArrowUpRight />
                            Download manual
                          </Button>
                        </ButtonGroup>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {hasDriveDownload && (
                  <Button
                    size="lg"
                    type="button"
                    disabled={!data?.linkDownload}
                    onClick={() =>
                      handleRedirectButtonAction(data?.linkDownload)
                    }
                  >
                    <DownloadIcon /> Episodios
                  </Button>
                )}

                {!data?.hideSubtitle && (
                  <Button
                    size="lg"
                    variant="secondary"
                    disabled={!data}
                    onClick={handleDownloadSubtitles}
                  >
                    <Subtitles /> Legendas
                  </Button>
                )}

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleRedirectToSagaList}
                >
                  <ListIcon /> Listagem da saga
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleRedirectToHome}
                >
                  <HomeIcon /> Ir para a home
                </Button>
              </div>

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
            </article>

            <aside className="flex h-full flex-col rounded-3xl border border-black/10 bg-white/45 p-5 shadow-xl shadow-black/10 backdrop-blur-md sm:p-6 md:p-7 xl:sticky xl:top-8 xl:h-fit dark:border-white/10 dark:bg-black/35 dark:shadow-black/40">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                  Status do arco
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visao geral baseada na planilha oficial do One Pace.
                </p>
              </div>

              <div className="mt-5 flex flex-1 items-center justify-center">
                {loading ? (
                  <div className="flex w-full flex-col items-center gap-3">
                    <p className="animate-pulse text-sm text-muted-foreground">
                      Sincronizando com a base de dados oficial...
                    </p>
                    <Card className="h-105 w-full max-w-sm animate-pulse border-border/60 bg-background/60 sm:max-w-md" />
                  </div>
                ) : error ||
                  !statsDoArco ||
                  statsDoArco.epsOriginais - statsDoArco.epsPace < 0 ? (
                  <ArcStatsError />
                ) : (
                  <ArcStatsCard stats={statsDoArco} />
                )}
              </div>
            </aside>
          </section>
        </section>
      </main>
    </BackgroundHeaderComponent>
  )
}

export default ArcDetailsView
