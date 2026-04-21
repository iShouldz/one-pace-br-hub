import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import SagaList from "../components/SagaList/saga-list.component"
import type { IHomeView } from "../types"
import { CheckCheck, SettingsIcon } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const HomeView = ({
  orderSagas,
  showAllSagas,
  onePieceSagas,
  handleToggleOrderList,
  handleHideCompletedSagas,
  handleRedirectToArcDetails,
  handleRedirectToSagaDetails,
}: IHomeView) => {
  return (
    <BackgroundHeaderComponent>
      <main className="relative z-10">
        <header className="m-4 flex justify-end">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex gap-2 ">
                  <SettingsIcon /> Configurações
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-xl border border-white/10 bg-black/90 p-0 shadow-lg">
                  <div className="min-w-50">
                    <NavigationMenuLink
                      onClick={handleHideCompletedSagas}
                      className="flex w-full px-5 py-3 text-left text-white transition-colors hover:bg-white/10"
                    >
                      Ocultar sagas concluídas{" "}
                      {!showAllSagas && <CheckCheck size={204} />}
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      onClick={handleToggleOrderList}
                      className="w-full px-5 py-3 text-left text-white transition-colors hover:bg-white/10"
                    >
                      Inverter ordem das sagas{" "}
                      {orderSagas && <CheckCheck size={204} />}
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </header>
        <section className="pointer-events-none absolute inset-x-0 top-0 flex h-[50svh] items-center">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="flex justify-center">
              <img
                src="/one-pace-logo.png"
                alt="One Pace Logo"
                className="w-64 max-w-full object-contain sm:w-90 md:w-125"
              />
            </div>
          </div>
        </section>

        <section className="lg:pt-[45svh] md:pt-[35svh]">
          <SagaList
            showAllSagas={showAllSagas}
            onePieceSagas={onePieceSagas}
            handleRedirectToArcDetails={handleRedirectToArcDetails}
            handleRedirectToSagaDetails={handleRedirectToSagaDetails}
          />
        </section>
      </main>
    </BackgroundHeaderComponent>
  )
}

export default HomeView
