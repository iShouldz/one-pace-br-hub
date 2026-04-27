import { useParams } from "react-router"
import SagaDetailsView from "../view/saga-details.view"
import { useCallback, useMemo } from "react"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { routePath, RoutesUrl } from "@/utils/enum/routes.utils"
import useOpData from "@/pages/home/hooks/use-op-data"
import useSeo from "@/hooks/use-seo"
import SagaDetailsLoading from "../components/saga-details-loading.component"
import ErrorView from "@/pages/error/error.view"

const SagaDetailsController = () => {
  const { sagaId } = useParams()
  const { data, isLoading } = useOpData()
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

  const handleRedirectToHome = useCallback(() => {
    handleRedirect(RoutesUrl.HOME)
  }, [handleRedirect])

  if (isLoading) {
    return <SagaDetailsLoading />
  }

  if (!currentSagaData) {
    return (
      <ErrorView
        title="Saga nao encontrada"
        description="Nao conseguimos encontrar os detalhes desta saga."
        primaryActionLabel="Voltar para a home"
        onPrimaryAction={handleRedirectToHome}
        secondaryActionLabel="Voltar"
        onSecondaryAction={handleBack}
      />
    )
  }

  return (
    <SagaDetailsView
      sagaId={sagaId!}
      data={currentSagaData}
      handleClickBack={handleBack}
      handleRedirectToHome={handleRedirectToHome}
      handleRedirectToArcDetails={handleRedirectToArcDetails}
    />
  )
}

export default SagaDetailsController
