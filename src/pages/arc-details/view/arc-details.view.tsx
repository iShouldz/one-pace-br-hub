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
import type { IArcDetailsView } from "../types"
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

const ArcDetailsView = ({
  data,
  handleBack,
  handleRedirectToHome,
  handleDownloadEpisodes,
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

  useEffect(() => {
    const completedArcs = getFromLocalStorage(StorageKeys.COMPLETED_ARCS)
    if (Array.isArray(completedArcs)) {
      setHasDoneArc(completedArcs.some((id) => String(id) === String(data?.id)))
    } else {
      setHasDoneArc(false)
    }
  }, [data?.id])

  const handleDownloadEpisodesAndMarkDone = () => {
    handleDownloadEpisodes()
    setHasDoneArc(true)
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
                  <Button size="lg" onClick={handleDownloadEpisodesAndMarkDone}>
                    <DownloadIcon /> Episodios
                  </Button>
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
