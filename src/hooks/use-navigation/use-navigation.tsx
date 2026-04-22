import { useNavigate } from "react-router"

const useNavigation = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const handleRedirect = (path: string, opts?: { external?: boolean }) => {
    const isExternal = opts?.external ?? /^https?:\/\//.test(path)
    if (isExternal) {
      window.open(path, "_blank")
    } else {
      navigate(path)
    }
  }

  return { handleBack, handleRedirect }
}

export default useNavigation
