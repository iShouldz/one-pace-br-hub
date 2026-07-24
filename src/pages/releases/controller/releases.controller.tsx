import { useEffect } from "react"
import ReleaseView from "../view/release.view"
import useChangelogData from "@/pages/home/hooks/use-changelog-data"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { RoutesUrl } from "@/utils/enum/routes.utils"

const ReleaseController = () => {
  const { handleRedirect } = useNavigation()
  const { data, isLoading, isError } = useChangelogData()

  useEffect(() => {
    if (isError) {
      handleRedirect(RoutesUrl.ERROR)
    }
  }, [isError])

  return (
    <ReleaseView entries={data?.logs} isLoading={isLoading} isError={isError} />
  )
}

export default ReleaseController
