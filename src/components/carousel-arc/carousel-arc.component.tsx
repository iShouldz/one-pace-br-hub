import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import type { ICarouselArc } from "./types"
import CardArcComponent from "../card-arc/card-arc.component"

const CarouselArcComponent = ({
  arcs,
  sagaId,
  handleRedirectToArcDetails,
}: ICarouselArc) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-3">
        {arcs?.map((arc) => (
          <CarouselItem
            key={arc.id}
            className="basis-[74%] pl-2 sm:basis-[48%] md:basis-[48%] md:pl-3 lg:basis-[26%] xl:basis-[20%]"
          >
            <CardArcComponent
              arc={arc}
              sagaId={sagaId}
              handleRedirectToArcDetails={handleRedirectToArcDetails}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default CarouselArcComponent
