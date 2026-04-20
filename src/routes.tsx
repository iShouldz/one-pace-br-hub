import { createBrowserRouter } from "react-router"
import { RoutesUrl } from "./utils/routes.utils"
import HomeController from "./pages/home/controller/home.controller"
import SagaDetailsController from "./pages/saga-details/controller/saga-details.controller"

export const routes = createBrowserRouter([
  { path: RoutesUrl.HOME, element: <HomeController /> },
  { path: RoutesUrl.SAGA_DETAILS, element: <SagaDetailsController /> },
])
