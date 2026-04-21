import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import SagaList from "../components/SagaList/saga-list.component"
import type { IHomeView } from "../types"
import { InfoIcon, SettingsIcon } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"

const HomeView = ({
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
                <NavigationMenuTrigger className="flex gap-2">
                  <SettingsIcon /> Configurações
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-fit rounded-xl border border-white/10 bg-black/90 p-0 shadow-lg">
                  <Button
                    onClick={handleHideCompletedSagas}
                    variant={"link"}
                    className="block w-full px-5 py-3 text-left text-white transition-colors hover:bg-white/10"
                  >
                    Ocultar sagas concluídas
                  </Button>
                  <Button
                    onClick={handleToggleOrderList}
                    className="block w-full px-5 py-3 text-left text-white transition-colors hover:bg-white/10"
                    variant={"link"}
                  >
                    Inverter ordem das sagas
                  </Button>
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

        <section className="pt-[60svh]">
          {showAllSagas && (
            <Item variant="muted">
              <ItemMedia variant="icon">
                <InfoIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>dasd</ItemTitle>
                <ItemDescription className="wrap-break-words text-ellipsis-none! overflow-visible! text-wrap! whitespace-pre-line">
                  {/* {info.description} */}
                </ItemDescription>
              </ItemContent>
            </Item>
            // <p className="mb-4 text-center text-sm text-white/70">
            //   Exibindo todas as sagas, incluindo as concluídas.
            // </p>
          )}
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
