import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  DownloadIcon,
  HomeIcon,
  ImageOff,
  InfoIcon,
  ListIcon,
  Subtitles,
} from "lucide-react"
import type { IArcDetailsView, IOnePaceArc } from "../types"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { getFromLocalStorage } from "@/utils/storage.utils"
import { StorageKeys } from "@/utils/storage-keys.utils"
import { useEffect, useState } from "react"
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

const ArcDetailsView = ({
  data,
  arcId,
  sagaId,
  handleBack,
  handleRedirectToHome,
  magnetLinks,
  handleDownloadEpisodes,
  handleCopyMagnetLinks,
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

  const [hasDoneArc, setHasDoneArc] = useState(false)
  const [isLoadingMagnets, setIsLoadingMagnets] = useState(false)

  useEffect(() => {
    const completedArcs: IOnePaceArc[] =
      getFromLocalStorage(StorageKeys.COMPLETED_ONE_PACE) || []
    setHasDoneArc(
      completedArcs
        ?.find((saga) => saga.id === sagaId)
        ?.arcos.includes(arcId!) ?? false
    )
  }, [data?.id])

  const handleDownloadEpisodesAndMarkDone = async () => {
    setIsLoadingMagnets(true)
    await handleDownloadEpisodes()
    setIsLoadingMagnets(false)
    setHasDoneArc(true)
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
              className="w-fit px-0 text-white"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>

            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {data?.title ?? "Arco não encontrado"}
            </h2>
            <p className="text-white/85">{data?.description}</p>
          </article>

          <section className="grid gap-6 pb-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur md:p-5">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                {data?.imagePath ? (
                  <img
                    src={data.imagePath}
                    alt={data.title}
                    className={`aspect-2/3 w-full object-cover transition-all duration-500 ${!hasDoneArc ? "grayscale" : ""}`}
                  />
                ) : (
                  <div className="flex aspect-2/3 items-center justify-center text-white/50">
                    <ImageOff className="size-6" />
                  </div>
                )}
              </div>
            </aside>
            <article className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur md:p-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Baixar este arco
                </h3>
                <p className="mt-2 text-sm text-white/70">
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
                    {data?.scrapping ? (
                      <DialogTrigger asChild>
                        <Button size="lg">
                          <DownloadIcon /> Episodios
                        </Button>
                      </DialogTrigger>
                    ) : null}
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
                              <p className="text-sm text-white/80">
                                Links encontrados. Você pode copiar automaticamente
                                ou manualmente:
                              </p>
                              <textarea
                                className="min-h-32 w-full rounded-md border border-white/20 bg-black/40 p-3 text-xs text-white"
                                readOnly
                                value={magnetLinks.join("\n")}
                              />
                            </div>
                          )}
                          <ButtonGroup>
                            <Button
                              type="button"
                              onClick={handleDownloadEpisodesAndMarkDone}
                              disabled={isLoadingMagnets}
                            >
                              {isLoadingMagnets
                                ? "Buscando links..."
                                : "Buscar links"}
                            </Button>
                            <Button
                              type="button"
                              onClick={handleCopyMagnetLinksClick}
                              disabled={!magnetLinks.length}
                            >
                              Copiar links
                            </Button>
                            <Button
                              type="button"
                              onClick={() =>
                                handleRedirectButtonAction(data?.linkDownload)
                              }
                            >
                              Download Manual
                            </Button>
                          </ButtonGroup>
                        </div>
                      </DialogFooter>
                    </DialogContent>

                    {!data?.scrapping && (
                      <Button
                        size="lg"
                        onClick={handleDownloadEpisodesAndMarkDone}
                      >
                        <DownloadIcon /> Episodios
                      </Button>
                    )}
                  </Dialog>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={handleDownloadSubtitles}
                  >
                    <Subtitles /> Legendas
                  </Button>
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
                <div className="mt-6 grid gap-3">
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
            </article>
          </section>
        </section>
      </main>
    </BackgroundHeaderComponent>
  )
}

export default ArcDetailsView
