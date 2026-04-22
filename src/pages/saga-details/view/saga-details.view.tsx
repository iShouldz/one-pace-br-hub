import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import type { ISagaDetailsView } from "../types"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import CardArcComponent from "@/components/card-arc/card-arc.component"

const SagaDetailsView = ({
  data,
  sagaId,
  handleClickBack,
  handleRedirectToArcDetails,
}: ISagaDetailsView) => {
  return (
    <BackgroundHeaderComponent direction="left">
      <section className="absolute flex flex-col gap-6 p-15">
        <article className="flex flex-col gap-4 md:w-full lg:w-[60%]">
          <Button
            variant="link"
            className="w-fit px-0 text-white sm:text-2xl"
            onClick={handleClickBack}
          >
            <ArrowLeft className="mr-2 size-7" />
            Voltar
          </Button>

          <h2 className="font-semibold tracking-tight sm:text-5xl lg:text-3xl">
            {data?.title}
          </h2>
          <p className="lg:text-md text-muted-foreground sm:text-2xl">
            {data?.description}
          </p>
        </article>

        <div className="columns-1 gap-6 md:columns-3 lg:columns-5">
          {data?.arcs.map((arc) => (
            <div key={arc.id} className="mb-4 break-inside-avoid">
              <CardArcComponent
                arc={arc}
                sagaId={sagaId}
                handleRedirectToArcDetails={handleRedirectToArcDetails}
              />
            </div>
          ))}
        </div>
      </section>
    </BackgroundHeaderComponent>
  )
}

export default SagaDetailsView
