import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import type { ISagaDetailsView } from "../types"

const SagaDetailsView = ({ data }: ISagaDetailsView) => {
  return (
    <BackgroundHeaderComponent direction="left">
      <section className="pointer-events-none absolute flex flex-col gap-4 p-15 lg:w-[60%] md:w-full">
        <h2 className="text-3xl font-semibold tracking-tight">{data?.title}</h2>{" "}
        <p>{data?.description}</p>
      </section>

      <section className="pt-[60svh]">{/* <SagaList /> */}</section>
    </BackgroundHeaderComponent>
  )
}

export default SagaDetailsView
