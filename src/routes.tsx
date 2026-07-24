import { createBrowserRouter } from "react-router"
import { RoutesUrl } from "./utils/enum/routes.utils"
import HomeController from "./pages/home/controller/home.controller"
import SagaDetailsController from "./pages/saga-details/controller/saga-details.controller"
import ArcDetailsController from "./pages/arc-details/controller/arc-details.controller"
import ErrorPage from "./pages/error/error.page"
import ReleaseController from "./pages/releases/controller/releases.controller"

export const routes = createBrowserRouter([
  { path: "*", element: <ErrorPage /> },
  { path: RoutesUrl.ERROR, element: <ErrorPage /> },
  { path: RoutesUrl.HOME, element: <HomeController /> },
  { path: RoutesUrl.RELEASES, element: <ReleaseController /> },
  { path: RoutesUrl.ARC_DETAILS, element: <ArcDetailsController /> },
  { path: RoutesUrl.SAGA_DETAILS, element: <SagaDetailsController /> },
  { path: RoutesUrl.ARC_DETAILS_LEGACY, element: <ArcDetailsController /> },
])
