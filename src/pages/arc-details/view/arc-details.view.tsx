import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
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
import { toast } from "sonner"
import { ArcStatsCard } from "../components/data-arc.component"
import { useOnePaceSheet } from "../hooks/use-one-pace-sheet"
import { Card } from "@/components/ui/card"
import { ArcStatsError } from "../components/data-arc-error.component"

const ArcDetailsView = ({
  data,
  arcId,
  sagaId,
  handleBack,
  magnetLinks,
  qbittorrentConfig,
  handleRedirectToHome,
  handleCopyMagnetLinks,
  handleDownloadEpisodes,
  handleSendToQbittorrent,
  handleDownloadSubtitles,
  handleRedirectToSagaList,
  handleRedirectButtonAction,
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
  const statsDoArco = getStatsForArc(data!.title)

  const handleDownloadEpisodesAndMarkDone = async () => {
    setIsLoadingMagnets(true)
    await handleDownloadEpisodes()
    setIsLoadingMagnets(false)
  }

  const handleCopyMagnetLinksClick = async () => {
    const copied = await handleCopyMagnetLinks(magnetLinks)
    if (!copied) {
      toast("Não foi possível copiar automaticamente", {
        description:
          "Copie manualmente os links abaixo e cole no seu cliente torrent.",
      })
    }
  }

  return (
    <BackgroundHeaderComponent direction="left">
      <main className="absolute inset-0 overflow-y-auto">
        <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-10 lg:px-16 lg:py-12">
          <article className="flex flex-col gap-4">
            <Button
              variant="link"
              className="w-fit px-0 text-lg text-white sm:text-2xl"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 size-5 sm:size-7" />
              Voltar
            </Button>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl lg:text-3xl">
              {data?.title ?? "Arco não encontrado"}
            </h2>
            <p className="lg:text-md text-base text-muted-foreground sm:text-2xl">
              {data?.description}
            </p>
          </article>

          <section className="grid min-h-[65svh] gap-6 pb-8 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur sm:p-5 md:p-6">
              <div>
                <h3 className="text-lg font-semibold text-white sm:text-3xl lg:text-lg">
                  Baixar este arco
                </h3>
                <p className="mt-2 text-sm text-white/70 sm:text-2xl lg:text-sm">
                  Escolha o que deseja baixar. Ao baixar os episodios, marcamos
                  este arco automaticamente como concluido. As legendas são
                  renomeadas para facilitar a identificação, mas não são
                  embutidas nos episodios, ou seja, é necessário usar um player
                  que suporte legendas externas, como o VLC, por exemplo. Para
                  serviços como o Jellyfin, é necessário colocar as legendas na
                  mesma pasta dos episodios para que sejam reconhecidas
                  automaticamente.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg">
                        <DownloadIcon /> Episodios
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col gap-6 sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Scrapping</DialogTitle>
                        <DialogDescription className="flex flex-col gap-4">
                          Esse arco provavelmente não esta concluido ou não foi
                          feito um bundle unico. Vamos fazer o scrapping dos
                          episodios para facilitar o download massivo dos
                          episodios para você. Caso selecione o download
                          multiplo, adicionaremos ao seu clipboard os links
                          torrents. Caso prefira, ainda pode baixar
                          individualmente abaixo.
                          <Item variant="muted">
                            <ItemMedia variant="icon">
                              <InfoIcon />
                            </ItemMedia>
                            <ItemContent>
                              <ItemTitle>O que é scrapping?</ItemTitle>
                              <ItemDescription className="wrap-break-words text-ellipsis-none! overflow-visible! text-wrap! whitespace-pre-line">
                                O scraping de site torrent é o processo
                                automatizado de extração de dados (como títulos,
                                links magnet, tamanhos de arquivo e contagem de
                                seeds/peers) de plataformas de compartilhamento
                                de arquivos P2P, como YTS, 1337x e Nyaa.si.
                              </ItemDescription>
                            </ItemContent>
                          </Item>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <div className="flex w-full flex-col gap-4">
                          {magnetLinks.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-white/80 sm:text-sm">
                                Links encontrados. Você pode copiar
                                automaticamente ou manualmente:
                              </p>
                              <textarea
                                className="min-h-32 w-full rounded-md border border-white/20 bg-black/40 p-2 text-xs text-white sm:p-3 sm:text-sm"
                                readOnly
                                value={magnetLinks.join("\n")}
                              />
                              <p className="text-xs text-white/80 sm:text-sm">
                                Caminho de salvamento do Qbittorent:{" "}
                                {qbittorrentConfig?.savePath}\{sagaId}\{arcId}
                              </p>
                            </div>
                          )}
                          <ButtonGroup>
                            {!data!.linkDownload.includes("drive") && (
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
                                {qbittorrentConfig?.baseUrl !== "" && (
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
                              onClick={() =>
                                handleRedirectButtonAction(data?.linkDownload)
                              }
                            >
                              <ArrowUpRight />
                              Download Manual
                            </Button>
                          </ButtonGroup>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {!data?.hideSubtitle && (
                    <Button
                      size="lg"
                      variant="secondary"
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
              </div>
              {informations.length > 0 && (
                <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto">
                  {informations.map((info) => (
                    <Item variant="muted" key={info.title}>
                      <ItemMedia variant="icon">
                        <InfoIcon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{info.title}</ItemTitle>
                        <ItemDescription className="wrap-break-words text-ellipsis-none! overflow-visible! text-wrap! whitespace-pre-line">
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
              )}
            </article>{" "}
            <aside className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur md:p-5">
              {loading && (
                <p className="animate-pulse text-zinc-500">
                  Sincronizando com a base de dados oficial...
                </p>
              )}
              <div className="flex justify-center md:justify-end">
                {loading ? (
                  <Card className="h-full w-full max-w-sm animate-pulse border-zinc-800 bg-zinc-950 sm:max-w-md" />
                ) : error || !statsDoArco || statsDoArco.epsOriginais - statsDoArco.epsPace < 0 ? (
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
