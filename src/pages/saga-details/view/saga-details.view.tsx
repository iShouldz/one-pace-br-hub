import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import type { ISagaDetailsView } from "../types"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const SagaDetailsView = ({ data, handleClickBack }: ISagaDetailsView) => {
  return (
    <BackgroundHeaderComponent direction="left">
      <section className="absolute flex flex-col gap-6 p-15">
        <article className="md:w-full lg:w-[60%] flex flex-col gap-4">
          <Button
            variant="link"
            className="w-fit px-0 text-white"
            onClick={handleClickBack}
          >
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Button>

          <h2 className="text-3xl font-semibold tracking-tight">
            {data?.title}
          </h2>
          <p>{data?.description}</p>
        </article>

        <div className="columns-1 gap-6 md:columns-3 lg:columns-5">
          {data?.arcs.map((arc) => (
            <div key={arc.id} className="mb-4 break-inside-avoid">
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
            </div>
          ))}
        </div>
      </section>
    </BackgroundHeaderComponent>
  )
}

export default SagaDetailsView
