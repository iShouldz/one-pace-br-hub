import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import type { ISagaDetailsView } from "../types"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const SagaDetailsView = ({ data, handleClickBack }: ISagaDetailsView) => {
  return (
    <BackgroundHeaderComponent direction="left">
      <section className="absolute flex flex-col gap-4 p-15 md:w-full lg:w-[60%]">
        <Button
          variant="link"
          className="w-fit px-0 text-white"
          onClick={handleClickBack}
        >
          <ArrowLeft className="mr-2 size-4" />
          Voltar
        </Button>

        <h2 className="text-3xl font-semibold tracking-tight">{data?.title}</h2>
        <p>{data?.description}</p>
      </section>
    </BackgroundHeaderComponent>
  )
}

export default SagaDetailsView
