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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { MenuIcon, LinkIcon, SettingsIcon, InfoIcon } from "lucide-react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item"
import { Separator } from "./ui/separator"
import ShowComponent from "@/pages/home/components/configs-menu/show/show.component"

type ConfigContentKey = "Exibição" | "Servidor torrent" | "Sobre"

const data = {
  nav: [
    {
      name: "Exibição",
      icon: <SettingsIcon />,
    },
    {
      name: "Servidor torrent",
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
    Exibição: (
      <ShowComponent
        handleHideGrayscale={handleHideGrayscale}
        handleToggleOrderList={handleToggleOrderList}
        handleHideCompletedSagas={handleHideCompletedSagas}
      />
    ),
    "Servidor torrent": (
      <Item variant="muted">
        <ItemMedia variant="icon">
          <LinkIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Servidor torrent</ItemTitle>
          <ItemDescription>Configurações do servidor torrent.</ItemDescription>
        </ItemContent>
      </Item>
    ),
    Sobre: (
      <Item variant="muted">
        <ItemMedia variant="icon">
          <InfoIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sobre</ItemTitle>
          <ItemDescription>Informações sobre o projeto.</ItemDescription>
        </ItemContent>
      </Item>
    ),
  }

  return (
    <Dialog open={openSettings} onOpenChange={handleToggleSettings}>
      <DialogContent className="overflow-hidden p-0 md:max-h-125 md:max-w-175 lg:max-w-200">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
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
          <main className="flex h-120 flex-1 flex-col overflow-hidden">
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
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {configContent[currentSeleted]}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
