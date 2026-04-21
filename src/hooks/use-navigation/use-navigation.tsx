import { useNavigate } from "react-router"

const useNavigation = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const handleRedirect = (path: string) => {
    navigate(path)
  }

  return { handleBack, handleRedirect }
}

export default useNavigation
