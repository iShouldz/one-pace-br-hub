import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import type { ISaga } from "../../types"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-3">
          {arcs.map((arc) => (
            <CarouselItem
              key={arc.id}
              className="basis-[74%] pl-2 sm:basis-[48%] md:basis-[34%] md:pl-3 lg:basis-[26%] xl:basis-[20%]"
            >
              <Card className="group relative overflow-hidden rounded-2xl border-white/12 bg-white/5 p-0 shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-black/50">
                <div className="relative">
                  <img
                    src={arc.imagePath ?? "/images/banners/poster.webp"}
                    alt={arc.title}
                    className="aspect-2/3 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#050918] via-[#050918]/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="text-base leading-tight font-semibold text-white">
                      {arc.title}
                    </h3>
                    <p className="mt-1 line-clamp-3 text-xs text-white/75">
                      {arc.description}
                    </p>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}

export default ArcBlockComponent
