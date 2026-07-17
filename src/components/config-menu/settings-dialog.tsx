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
import { SettingsIcon, InfoIcon, BookOpenText, BookCheck } from "lucide-react"

import { Separator } from "../ui/separator"
import ShowComponent from "@/components/config-menu/show/show.component"
import AboutComponent from "./about/about.component"
import TorrentServerComponet from "./torrent-server/torrent-server.component"
import type { ResolvedTheme } from "../theme-provider"
import FeedbackComponent from "./feedback/feedback.component"
import UsefullLinksComponent from "./usefull-links/usefull-links.component"
import StremioComponent from "./stremio/stremio.component"

export type ConfigContentKey =
  | "Exibição"
  | "Provedor torrent"
  | "Sobre"
  | "Stremio Addon"
  | "Feedback"
  | "Ler mangá online"

const data = {
  nav: [
    {
      name: "Exibição",
      icon: <SettingsIcon />,
    },
    { name: "Feedback", icon: <BookOpenText /> },
    {
      name: "Stremio Addon",
      icon: (
        <img
          src="/images/icons/stremio.webp"
          alt="stremio"
          className="size-4 opacity-80 grayscale"
        />
      ),
    },
    {
      name: "Provedor torrent",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0,0,256,256"
        >
          <g
            fill="#7f7f7f"
            fill-rule="nonzero"
            stroke="none"
            stroke-width="1"
            stroke-linecap="butt"
            stroke-linejoin="miter"
            stroke-miterlimit="10"
            stroke-dasharray=""
            stroke-dashoffset="0"
            font-family="none"
            font-weight="none"
            font-size="none"
            text-anchor="none"
            style={{ mixBlendMode: "normal" }}
          >
            <g transform="scale(5.12,5.12)">
              <path d="M25,2c-12.683,0 -23,10.317 -23,23c0,12.683 10.317,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.683 -10.317,-23 -23,-23zM40.5,30.963c-3.1,0 -4.9,-2.4 -4.9,-2.4c0,0 -1.5,6.437 -8.6,6.437c-1.4,0 -3.6,-0.837 -3.6,-0.837l4.17,9.643c-0.843,0.114 -1.696,0.194 -2.57,0.194c-2.157,0 -4.222,-0.377 -6.155,-1.039l-9.608,-26.11c0,0 -0.7,-1.2 0.4,-1.5c1.1,-0.3 5.4,-1.2 5.4,-1.2c0,0 1.475,-0.494 1.8,0.5c0.5,1.3 4.063,11.112 4.063,11.112c0,0 1.7,3.237 6.5,3.237c4.7,0 5.9,-3.437 5.7,-3.937c-1.2,-3 -4.993,-11.862 -4.993,-11.862c0,0 -0.6,-1.1 0.8,-1.4c1.4,-0.3 3.8,-0.7 3.8,-0.7c0,0 1.105,-0.163 1.6,0.8c0.738,1.437 5.193,11.262 5.193,11.262c0,0 1.1,2.9 3.3,2.9c0.464,0 0.834,-0.046 1.152,-0.104c-0.082,1.635 -0.348,3.221 -0.817,4.722c-0.594,0.186 -1.379,0.282 -2.635,0.282z"></path>
            </g>
          </g>
        </svg>
      ),
    },
    { name: "Ler mangá online", icon: <BookCheck /> },
    {
      name: "Sobre",
      icon: <InfoIcon />,
    },
  ],
} as const

interface ISettingsDialog {
  openSettings: boolean
  hideGrayscale: boolean
  currentTheme: ResolvedTheme
  handleToggleTheme: () => void
  handleHideGrayscale: () => void
  handleRedirectToForm: () => void
  handleToggleSettings: () => void
  handleToggleOrderList: () => void
  handleHideCompletedSagas: () => void
  handleRedirectToIssuesGithub: () => void
  defaultOptionOpenConfig?: ConfigContentKey
  handleRedirectToIssuesGithubSubttitle: () => void
}

export function SettingsDialog({
  currentTheme,
  openSettings,
  hideGrayscale,
  handleToggleTheme,
  handleHideGrayscale,
  handleRedirectToForm,
  handleToggleSettings,
  handleToggleOrderList,
  defaultOptionOpenConfig,
  handleHideCompletedSagas,
  handleRedirectToIssuesGithub,
  handleRedirectToIssuesGithubSubttitle,
}: ISettingsDialog) {
  const [currentSeleted, setCurrentSelected] = React.useState<ConfigContentKey>(
    defaultOptionOpenConfig ?? "Exibição"
  )

  const configContent: Record<ConfigContentKey, React.ReactElement> = {
    Sobre: <AboutComponent />,
    "Provedor torrent": <TorrentServerComponet />,
    "Ler mangá online": <UsefullLinksComponent />,
    "Stremio Addon": <StremioComponent />,
    Exibição: (
      <ShowComponent
        currentTheme={currentTheme}
        hideGrayscale={hideGrayscale}
        handleToggleTheme={handleToggleTheme}
        handleHideGrayscale={handleHideGrayscale}
        handleToggleOrderList={handleToggleOrderList}
        handleHideCompletedSagas={handleHideCompletedSagas}
      />
    ),
    Feedback: (
      <FeedbackComponent
        handleRedirectToForm={handleRedirectToForm}
        handleRedirectToIssuesGithub={handleRedirectToIssuesGithub}
        handleRedirectToIssuesGithubSubttitle={
          handleRedirectToIssuesGithubSubttitle
        }
      />
    ),
  }

  React.useEffect(() => {
    if (!openSettings) {
      return
    }

    const nextOption = defaultOptionOpenConfig ?? "Exibição"

    setCurrentSelected(nextOption)
  }, [defaultOptionOpenConfig, openSettings])

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
