import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import "./i18n"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "react-router"
import { routes } from "./routes.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <RouterProvider router={routes} />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
