import type { ISaga } from "../../types"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import CarouselArcComponent from "@/components/carousel-arc/carousel-arc.component"

const ArcBlockComponent = ({
  arcs,
  title,
  sagaId,
  handleRedirectToSagaDetails,
}: ISaga) => {
  return (
    <section className="flex flex-col gap-4 px-5 pt-6 pb-16 sm:px-8">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>{" "}
          <div className="flex items-center gap-4">
            <Button
              variant="link"
              size="sm"
              onClick={() => handleRedirectToSagaDetails(sagaId)}
            >
              <p className="text-white">Ver mais</p> <ArrowRight />
            </Button>
          </div>
        </div>
        <p className="text-sm text-white/60">{arcs.length} arcos</p>
      </div>

      <CarouselArcComponent arcs={arcs} />
    </section>
  )
}

export default ArcBlockComponent
