import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const sendJson = (res: any, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.end(JSON.stringify(payload))
}

const readJsonBody = async (req: any): Promise<any> => {
  const chunks: Uint8Array[] = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  }

  if (!chunks.length) return {}

  const raw = Buffer.concat(chunks).toString("utf-8")
  return raw ? JSON.parse(raw) : {}
}

const isValidHttpUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

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

      server.middlewares.use("/api/qbittorrent", async (req: any, res: any) => {
        if (req.method !== "POST") {
          sendJson(res, 405, { error: "Metodo nao permitido" })
          return
        }

        try {
          const body = await readJsonBody(req)
          const links = Array.isArray(body?.links)
            ? body.links.filter(Boolean)
            : []
          const config = body?.config

          if (!links.length) {
            sendJson(res, 400, { error: "Lista de links vazia" })
            return
          }

          if (!config?.baseUrl || !isValidHttpUrl(config.baseUrl)) {
            sendJson(res, 400, { error: "baseUrl invalida (use http/https)" })
            return
          }

          if (!config.username || !config.password) {
            sendJson(res, 400, { error: "Usuario e senha sao obrigatorios" })
            return
          }

          const normalizedBaseUrl = config.baseUrl.trim().replace(/\/+$/, "")

          const loginBody = new URLSearchParams({
            username: config.username,
            password: config.password,
          })

          const loginResponse = await fetch(
            `${normalizedBaseUrl}/api/v2/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
              },
              body: loginBody.toString(),
            }
          )

          if (!loginResponse.ok) {
            sendJson(res, loginResponse.status, {
              error: "Falha ao autenticar no qBittorrent",
            })
            return
          }

          const authText = (await loginResponse.text()).trim().toLowerCase()
          if (authText !== "ok.") {
            sendJson(res, 401, {
              error: "Credenciais invalidas no qBittorrent",
            })
            return
          }

          const setCookieHeader = loginResponse.headers.get("set-cookie")
          const sidMatch = setCookieHeader?.match(/SID=([^;]+)/i)
          const sidCookie = sidMatch ? `SID=${sidMatch[1]}` : ""

          if (!sidCookie) {
            sendJson(res, 401, {
              error: "Nao foi possivel obter sessao (cookie SID)",
            })
            return
          }

          const addBody = new URLSearchParams({
            urls: links.join("\n"),
          })

          if (config.savePath?.trim()) {
            addBody.append("savepath", config.savePath.trim())
          }

          const addResponse = await fetch(
            `${normalizedBaseUrl}/api/v2/torrents/add`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                Cookie: sidCookie,
              },
              body: addBody.toString(),
            }
          )

          if (!addResponse.ok) {
            const errorText = await addResponse.text().catch(() => "")
            sendJson(res, addResponse.status, {
              error: "Falha ao adicionar torrents",
              detail: errorText,
            })
            return
          }

          sendJson(res, 200, { ok: true })
        } catch (error: any) {
          sendJson(res, 500, {
            error: "Erro ao enviar torrents para o qBittorrent",
            detail: error?.message || "desconhecido",
          })
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
