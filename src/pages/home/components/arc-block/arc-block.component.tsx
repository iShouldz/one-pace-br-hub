import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import type { Saga } from "../../utils/saga.utils"

const ArcBlockComponent = ({ arcs, title }: Saga) => {
  return (
    <section className="flex flex-col gap-6 px-5 pt-6 pb-16 sm:px-8">
      <h2 className="text-3xl">{title}</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="lg:w-[80%] sm:w-90 md:w-125 "
      >
        <CarouselContent>
          {arcs.map((arcosSaga) => (
            <CarouselItem key={arcosSaga.id} className="basis-1/2 lg:basis-1/5">
              <div className="p-1">
                <Card>
                  <img
                    src={arcosSaga.imagePath ?? "/images/banners/poster.webp"}
                    alt="Event cover"
                    // className="relative z-20 aspect-video w-full object-cover "
                  />
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}

export default ArcBlockComponent
