import { useParams } from "react-router"
import SagaDetailsView from "../view/saga-details.view"
import { useCallback, useMemo } from "react"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { routePath } from "@/utils/enum/routes.utils"
import useOpData from "@/pages/home/hooks/use-op-data"
import useSeo from "@/hooks/use-seo"

const SagaDetailsController = () => {
  const { sagaId } = useParams()
  const { data} = useOpData()
  const { handleRedirect, handleBack } = useNavigation()

  const currentSagaData = useMemo(
    () => data?.sagas?.find((saga) => saga.id === sagaId),
    [data, sagaId]
  )

  useSeo({
    title: `${currentSagaData?.title ?? "Saga"} | One Pace Legendado PT-BR`,
    description:
      currentSagaData?.description ??
      "Veja os arcos do One Pace com organização por saga e suporte a legendas PT-BR.",
    path: `/saga/${sagaId ?? ""}`,
    keywords: `one pace ${currentSagaData?.title ?? "saga"}, one pace legendado pt br, one pace brasil`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: currentSagaData?.title ?? "Saga",
      inLanguage: "pt-BR",
      description: currentSagaData?.description,
    },
  })

  const handleRedirectToArcDetails = useCallback(
    (sagaId: string, arcId: string) => {
      handleRedirect(routePath.arcDetails(sagaId, arcId))
    },
    [handleRedirect]
  )

  return (
    <SagaDetailsView
      sagaId={sagaId!}
      data={currentSagaData}
      handleClickBack={handleBack}
      handleRedirectToArcDetails={handleRedirectToArcDetails}
    />
  )
}

export default SagaDetailsController
