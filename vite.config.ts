import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

function scrapeProxyPlugin() {
  return {
    name: "scrape-proxy-plugin",
    configureServer(server: any) {
      server.middlewares.use("/api/scrape", async (req: any, res: any) => {
        try {
          const requestUrl = new URL(req.url || "", "http://localhost")
          const targetUrl = requestUrl.searchParams.get("url")

          if (!targetUrl) {
            res.statusCode = 400
            res.setHeader("Content-Type", "text/plain; charset=utf-8")
            res.end("Parametro 'url' e obrigatorio")
            return
          }

          let parsedTarget: URL
          try {
            parsedTarget = new URL(targetUrl)
          } catch {
            res.statusCode = 400
            res.setHeader("Content-Type", "text/plain; charset=utf-8")
            res.end("URL invalida")
            return
          }

          if (!["http:", "https:"].includes(parsedTarget.protocol)) {
            res.statusCode = 400
            res.setHeader("Content-Type", "text/plain; charset=utf-8")
            res.end("Somente URLs http/https sao permitidas")
            return
          }

          const response = await fetch(parsedTarget.toString(), {
            method: "GET",
            redirect: "follow",
            headers: {
              "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
              accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            },
          })

          const html = await response.text()
          res.statusCode = response.status
          res.setHeader("Content-Type", "text/html; charset=utf-8")
          res.end(html)
        } catch (error: any) {
          res.statusCode = 500
          res.setHeader("Content-Type", "text/plain; charset=utf-8")
          res.end(`Erro no scrape: ${error?.message || "desconhecido"}`)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), scrapeProxyPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
