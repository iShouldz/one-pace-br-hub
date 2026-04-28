import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Button } from "@/components/ui/button"
import { DownloadIcon, HomeIcon, ListIcon, Subtitles } from "lucide-react"
import type { IArcDetailsView } from "../types"
import { useState } from "react"
import type { IInformationProps } from "@/pages/home/types"
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
import ScrappingModalComponent from "../components/scrapping-modal.component"
import InformationListComponent from "../components/informations-list.component"

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
                  {data?.title}
                </h2>
                <p className="text-base text-muted-foreground sm:text-lg">
                  {data?.description}
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
                  este arco automaticamente como concluido. As legendas são
                  renomeadas para facilitar a identificação, mas não são
                  embutidas nos episodios. Para servicos como o Jellyfin, as
                  legendas precisam ficar na mesma pasta dos episodios.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ScrappingModalComponent
                  arcId={arcId}
                  sagaId={sagaId}
                  magnetLinks={magnetLinks}
                  isLoadingMagnets={isLoadingMagnets}
                  handleDownloadEpisodesAndMarkDone={
                    handleDownloadEpisodesAndMarkDone
                  }
                  hasDriveDownload={hasDriveDownload}
                  qbittorrentConfig={qbittorrentConfig}
                  manualDownloadLink={data?.linkDownload}
                  handleSendToQbittorrent={handleSendToQbittorrent}
                  handleCopyMagnetLinksClick={handleCopyMagnetLinksClick}
                  handleRedirectButtonAction={handleRedirectButtonAction}
                />

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

              <InformationListComponent
                informations={informations}
                handleRedirectButtonAction={handleRedirectButtonAction}
              />
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
