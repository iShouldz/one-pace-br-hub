import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import type { ISagaDetailsView } from "../types"
import { LayoutGrid } from "lucide-react"
import CardArcComponent from "@/components/card-arc/card-arc.component"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { capitalizeWords } from "@/utils/capitalize.utils"

const SagaDetailsView = ({
  data,
  sagaId,
  handleRedirectToHome,
  handleRedirectToArcDetails,
}: ISagaDetailsView) => {
  const arcCount = data?.arcs?.length ?? 0

  return (
    <BackgroundHeaderComponent
      direction="left"
      imageUrl="/images/wallpaper-background.webp"
    >
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
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center justify-center gap-2">
                    {capitalizeWords(sagaId!?.replace(/-/g, " "))}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl lg:text-3xl">
                  {data?.title ?? "Saga nao encontrada"}
                </h2>
                <p className="text-base text-muted-foreground sm:text-lg lg:text-xl">
                  {data?.description ??
                    "Nao encontramos os detalhes desta saga no momento."}
                </p>
              </div>
            </div>
          </article>

          <section className="rounded-3xl border border-black/10 bg-white/45 p-4 shadow-xl shadow-black/10 backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-black/35 dark:shadow-black/40">
            <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="flex w-fit flex-col items-start text-xl font-semibold tracking-tight sm:text-2xl">
                Lista de arcos
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-sm font-medium text-foreground dark:border-white/15 dark:bg-black/40">
                  <LayoutGrid className="size-4" />
                  <span>{arcCount} arcos</span>
                </div>
              </h3>
              <p className="flex flex-col items-start text-sm text-muted-foreground">
                Selecione um arco para abrir os detalhes e opções de download.
              </p>
            </div>

            {arcCount > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {data?.arcs.map((arc) => (
                  <div key={arc.id} className="w-full [&>div]:mb-0">
                    <CardArcComponent
                      arc={arc}
                      sagaId={sagaId}
                      handleRedirectToArcDetails={handleRedirectToArcDetails}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/50 p-8 text-center text-sm text-muted-foreground">
                Nenhum arco disponivel para esta saga no momento.
              </div>
            )}
          </section>
        </section>
      </main>
    </BackgroundHeaderComponent>
  )
}

export default SagaDetailsView
