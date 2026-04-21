import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { IArcDetailsView } from "../types"

const ArcDetailsView = ({ handleBack, data }: IArcDetailsView) => {
  return (
    <BackgroundHeaderComponent direction="left">
      <section className="absolute flex flex-col gap-6 p-15">
        <article className="flex flex-col gap-4 md:w-full lg:w-[60%]">
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
      </section>
    </BackgroundHeaderComponent>
  )
}

export default ArcDetailsView
