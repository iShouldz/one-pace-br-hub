import { createBrowserRouter } from "react-router"
import { RoutesUrl } from "./utils/routes.utils"
import HomeController from "./pages/home/controller/home.controller"

export const routes = createBrowserRouter([
  { path: RoutesUrl.HOME, element: <HomeController /> },
])
