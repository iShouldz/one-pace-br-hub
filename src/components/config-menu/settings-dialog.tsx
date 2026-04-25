"use client"

import * as React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { MenuIcon, SettingsIcon, InfoIcon } from "lucide-react"

import { Separator } from "../ui/separator"
import ShowComponent from "@/components/config-menu/show/show.component"
import AboutComponent from "./about/about.component"
import TorrentServerComponet from "./torrent-server/torrent-server.component"

type ConfigContentKey = "Exibição" | "Provedor torrent" | "Sobre"

const data = {
  nav: [
    {
      name: "Exibição",
      icon: <SettingsIcon />,
    },
    {
      name: "Provedor torrent",
      icon: <MenuIcon />,
    },
    {
      name: "Sobre",
      icon: <InfoIcon />,
    },
  ],
} as const

interface ISettingsDialog {
  openSettings: boolean
  handleHideGrayscale: () => void
  handleToggleSettings: () => void
  handleToggleOrderList: () => void
  handleHideCompletedSagas: () => void
}

export function SettingsDialog({
  openSettings,
  handleHideGrayscale,
  handleToggleSettings,
  handleToggleOrderList,
  handleHideCompletedSagas,
}: ISettingsDialog) {
  const [currentSeleted, setCurrentSelected] =
    React.useState<ConfigContentKey>("Exibição")

  const configContent: Record<ConfigContentKey, React.ReactElement> = {
    Sobre: <AboutComponent />,
    "Provedor torrent": <TorrentServerComponet />,
    Exibição: (
      <ShowComponent
        handleHideGrayscale={handleHideGrayscale}
        handleToggleOrderList={handleToggleOrderList}
        handleHideCompletedSagas={handleHideCompletedSagas}
      />
    ),
  }

  return (
    <Dialog open={openSettings} onOpenChange={handleToggleSettings}>
      <DialogContent className="grid-rows-[minmax(0,1fr)] gap-0 overflow-hidden p-0 md:h-[85vh] md:max-h-[85vh] md:max-w-175 lg:h-[70vh] lg:max-h-[70vh] lg:max-w-220">
        <SidebarProvider className="h-full min-h-0! w-full items-stretch overflow-hidden">
          <Sidebar collapsible="none" className="h-full shrink-0 md:flex">
            <SidebarContent className="h-full">
              <SidebarGroup className="h-full">
                <SidebarGroupContent className="h-full">
                  <SidebarMenu className="flex h-full flex-col">
                    {data.nav.map((item, index) => (
                      <SidebarMenuItem
                        key={item.name}
                        className={
                          index === data.nav.length - 1 ? "mt-auto" : ""
                        }
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === currentSeleted}
                          onClick={() => setCurrentSelected(item.name)}
                        >
                          <a href="#">
                            {item.icon}
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <Separator orientation="vertical" />
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Configurações</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {
                          data.nav.find((item) => item.name === currentSeleted)
                            ?.name
                        }
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {configContent[currentSeleted]}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
