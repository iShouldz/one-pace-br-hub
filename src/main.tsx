import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import "./i18n"
import { QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "react-router"
import { routes } from "./routes.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { Analytics } from "@vercel/analytics/react"
import { queryClient } from "@/lib/query-client"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <RouterProvider router={routes} />
          <Toaster />
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
