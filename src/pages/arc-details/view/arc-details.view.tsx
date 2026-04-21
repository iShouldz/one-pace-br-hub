import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ArrowUpRightIcon,
  DownloadIcon,
  ImageOff,
  InfoIcon,
  Subtitles,
} from "lucide-react"
import type { IArcDetailsView } from "../types"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const ArcDetailsView = ({
  data,
  handleBack,
  handleDownloadEpisodes,
  handleDownloadSubtitles,
}: IArcDetailsView) => {
  const informations = [
    ...(data?.informations ?? []),
    {
      title: "Sobre o One Pace",
      description:
        "Esse hub é apenas um agregador para legendas pt-br, apenas facilitamos o acesso às legendas criadas pela comunidade. Todos os creditos para o ",
    },
  ]

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
                    className="aspect-2/3 w-full object-cover"
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
                  este arco automaticamente como concluido.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button size="lg" onClick={handleDownloadEpisodes}>
                    <DownloadIcon /> Download episodios
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={handleDownloadSubtitles}
                  >
                    <Subtitles /> Download legendas
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
                        <ItemDescription>
                          {info.description}{" "}
                          {info.description.includes("creditos") && (
                            <a
                              target="_blank"
                              href="https://onepace.net/"
                              className="inline-flex items-center gap-1 text-zinc-300 hover:text-zinc-500"
                            >
                              One Pace
                              <ArrowUpRightIcon data-icon="inline-end" />
                            </a>
                          )}
                        </ItemDescription>
                      </ItemContent>
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
