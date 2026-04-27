import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import CarouselArcComponent from "@/components/carousel-arc/carousel-arc.component"
import type { IArcBlockComponent } from "../types"

const ArcBlockComponent = ({
  arcs,
  title,
  sagaId,
  handleRedirectToArcDetails,
  handleRedirectToSagaDetails,
}: IArcBlockComponent) => {
  return (
    <section className="flex flex-col gap-4 px-5 pt-6 pb-16 sm:px-8">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold tracking-tight md:text-5xl lg:text-3xl">
            {title}
          </h2>{" "}
          <div className="flex items-center gap-4">
            <Button
              variant="link"
              size="sm"
              className="md:text-2xl lg:text-sm"
              onClick={() => handleRedirectToSagaDetails(sagaId)}
            >
              <p className="text-accent-foreground">Ver mais</p> <ArrowRight />
            </Button>
          </div>
        </div>
        <p className="text-shadow-background md:text-3xl lg:text-sm">
          {arcs.length} arcos
        </p>
      </div>

      <CarouselArcComponent
        arcs={arcs}
        sagaId={sagaId}
        handleRedirectToArcDetails={handleRedirectToArcDetails}
      />
    </section>
  )
}

export default ArcBlockComponent
