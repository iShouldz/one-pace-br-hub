import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { IArcDetailsView } from "../types"
import { ButtonGroup } from "@/components/ui/button-group"

const ArcDetailsView = ({
  data,
  handleBack,
  handleDownloadEpisodes,
  handleDownloadSubtitles,
}: IArcDetailsView) => {
  return (
    <BackgroundHeaderComponent direction="left">
      <section className="absolute flex h-screen w-full flex-col justify-between gap-6 p-15">
        <article className="flex flex-col gap-4 md:w-full lg:w-[50%]">
          <Button
            variant="link"
            className="w-fit px-0 text-white"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Button>

          <h2 className="text-3xl font-semibold tracking-tight">
            {data?.title}
          </h2>
          <p>{data?.description}</p>
        </article>

        <section className="flex items-center justify-between gap-4 lg:flex">
          <ButtonGroup className="h-full">
            <Button
              size="lg"
              className="w-full"
              onClick={handleDownloadEpisodes}
            >
              Download episodios
            </Button>
            <Button
              size="lg"
              className="w-full"
              onClick={handleDownloadSubtitles}
            >
              Download legendas
            </Button>
          </ButtonGroup>
        </section>
      </section>
    </BackgroundHeaderComponent>
  )
}

export default ArcDetailsView
