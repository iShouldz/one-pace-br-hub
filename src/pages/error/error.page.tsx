import ErrorView from "./error.view"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { RoutesUrl } from "@/utils/enum/routes.utils"

const ErrorPage = () => {
  const { handleRedirect, handleBack } = useNavigation()

  return (
    <ErrorView
      title="Página não encontrada"
      secondaryActionLabel="Voltar"
      onSecondaryAction={handleBack}
      primaryActionLabel="Voltar para a home"
      onPrimaryAction={() => handleRedirect(RoutesUrl.HOME)}
      description="A rota que você tentou acessar não existe ou foi movida."
    />
  )
}

export default ErrorPage
