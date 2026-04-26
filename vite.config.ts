import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { cloudflare } from "@cloudflare/vite-plugin";

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

const BLOCKED_STATUSES = new Set([401, 403, 429, 503])

const NYAA_HOSTS = new Set([
  "nyaa.si",
  "www.nyaa.si",
  "sukebei.nyaa.si",
  "www.sukebei.nyaa.si",
])

const buildScrapeHeaders = (target: URL, mode: "html" | "rss" = "html") => {
  return {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    accept:
      mode === "rss"
        ? "application/rss+xml,application/xml;q=0.9,text/xml;q=0.8,*/*;q=0.7"
        : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    pragma: "no-cache",
    referer: `${target.origin}/`,
    origin: target.origin,
  }
}

const getNyaaViewTorrentUrl = (target: URL): string | null => {
  const match = target.pathname.match(/^\/view\/(\d+)\/?$/)
  if (!match) return null
  return `${target.origin}/download/${match[1]}.torrent`
}

const getNyaaRssUrlByPage = (target: URL, page: number): URL => {
  const rssUrl = new URL(target.origin)
  rssUrl.pathname = "/"
  rssUrl.searchParams.set("page", "rss")

  const q = target.searchParams.get("q")
  const c = target.searchParams.get("c")
  const f = target.searchParams.get("f")
  const s = target.searchParams.get("s")
  const o = target.searchParams.get("o")

  if (q) rssUrl.searchParams.set("q", q)
  if (c) rssUrl.searchParams.set("c", c)
  if (f) rssUrl.searchParams.set("f", f)
  if (s) rssUrl.searchParams.set("s", s)
  if (o) rssUrl.searchParams.set("o", o)
  if (page > 1) rssUrl.searchParams.set("p", String(page))

  return rssUrl
}

const extractRssItems = (xml: string): string[] => {
  return Array.from(xml.matchAll(/<item>[\s\S]*?<\/item>/g)).map(
    (match) => match[0]
  );
}

const extractInfoHash = (itemXml: string): string => {
  return (itemXml.match(/<nyaa:infoHash>([a-fA-F0-9]{40})<\/nyaa:infoHash>/)?.[1] || "");
}

const extractNyaaViewIds = (html: string): string[] => {
  const ids = new Set<string>()
  const viewIdRegex = /\/view\/(\d+)/g

  for (const match of html.matchAll(viewIdRegex)) {
    const id = match[1]
    if (id) ids.add(id)
  }

  return [...ids]
}

const buildNyaaDownloadUrls = (target: URL, ids: string[]): string => {
  return ids.map((id) => `${target.origin}/download/${id}.torrent`).join("\n")
}

const buildMergedRss = (items: string[]): string => {
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>${items.join("")}</channel></rss>`
}

const fetchNyaaAggregatedRss = async (
  parsedTarget: URL,
  maxPages = 8
): Promise<string | null> => {
  const allItems: string[] = []
  const seenHashes = new Set<string>()

  for (let page = 1; page <= maxPages; page++) {
    const rssUrl = getNyaaRssUrlByPage(parsedTarget, page)
    const rssResponse = await fetch(rssUrl.toString(), {
      method: "GET",
      redirect: "follow",
      headers: buildScrapeHeaders(parsedTarget, "rss"),
    })

    if (!rssResponse.ok) {
      break
    }

    const rssXml = await rssResponse.text()
    const pageItems = extractRssItems(rssXml)

    if (!pageItems.length) {
      break
    }

    for (const item of pageItems) {
      const hash = extractInfoHash(item)
      if (hash && !seenHashes.has(hash)) {
        seenHashes.add(hash)
        allItems.push(item)
      }
    }

    if (pageItems.length < 75) {
      break
    }
  }

  if (!allItems.length) return null
  return buildMergedRss(allItems)
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

          const pagesParam = Number(requestUrl.searchParams.get("pages") || "")
          const requestedPages = Number.isFinite(pagesParam)
            ? Math.max(1, Math.min(8, pagesParam))
            : 4

          const isNyaaHost = NYAA_HOSTS.has(parsedTarget.hostname)
          const hasSearchQuery = Boolean(parsedTarget.searchParams.get("q"))

          // Para URLs diretas /view/{id}, retorna o torrent direto
          if (isNyaaHost) {
            const viewTorrentUrl = getNyaaViewTorrentUrl(parsedTarget)
            if (viewTorrentUrl) {
              res.statusCode = 200
              res.setHeader("Content-Type", "text/plain; charset=utf-8")
              res.setHeader("X-Scrape-Fallback", "nyaa-view-download-url")
              res.end(viewTorrentUrl)
              return
            }

            // Para queries (?q=...), sempre usa RSS (HTML de busca não serve)
            if (hasSearchQuery) {
              const rssXml = await fetchNyaaAggregatedRss(parsedTarget, requestedPages)
              if (rssXml) {
                res.statusCode = 200
                res.setHeader("Content-Type", "application/rss+xml; charset=utf-8")
                res.setHeader("X-Scrape-Fallback", "nyaa-rss-aggregated")
                res.end(rssXml)
                return
              }

              const htmlFallbackResponse = await fetch(parsedTarget.toString(), {
                method: "GET",
                redirect: "follow",
                headers: buildScrapeHeaders(parsedTarget, "html"),
              })

              if (htmlFallbackResponse.ok) {
                const html = await htmlFallbackResponse.text()
                const ids = extractNyaaViewIds(html)

                if (ids.length) {
                  const downloadUrls = buildNyaaDownloadUrls(parsedTarget, ids)
                  res.statusCode = 200
                  res.setHeader("Content-Type", "text/plain; charset=utf-8")
                  res.setHeader("X-Scrape-Fallback", "nyaa-html-view-download-urls")
                  res.end(downloadUrls)
                  return
                }
              }

              // Se RSS falhar, retorna erro claro
              res.statusCode = 503
              res.setHeader("Content-Type", "text/plain; charset=utf-8")
              res.end("Nenhum torrent encontrado na busca ou Nyaa limitou as requisicoes")
              return
            }
          }

          // Para outras URLs (não-query), tenta buscar HTML normalmente
          const response = await fetch(parsedTarget.toString(), {
            method: "GET",
            redirect: "follow",
            headers: buildScrapeHeaders(parsedTarget, "html"),
          })

          if (BLOCKED_STATUSES.has(response.status) && isNyaaHost) {
            const viewTorrentUrl = getNyaaViewTorrentUrl(parsedTarget)

            if (viewTorrentUrl) {
              res.statusCode = 200
              res.setHeader("Content-Type", "text/plain; charset=utf-8")
              res.setHeader("X-Scrape-Fallback", "nyaa-view-download-url")
              res.end(viewTorrentUrl)
              return
            }

            const rssXml = await fetchNyaaAggregatedRss(parsedTarget, requestedPages)

            if (rssXml) {
              res.statusCode = 200
              res.setHeader("Content-Type", "application/rss+xml; charset=utf-8")
              res.setHeader("X-Scrape-Fallback", "nyaa-rss-aggregated")
              res.end(rssXml)
              return
            }

            const htmlFallbackResponse = await fetch(parsedTarget.toString(), {
              method: "GET",
              redirect: "follow",
              headers: buildScrapeHeaders(parsedTarget, "html"),
            })

            if (htmlFallbackResponse.ok) {
              const html = await htmlFallbackResponse.text()
              const ids = extractNyaaViewIds(html)

              if (ids.length) {
                const downloadUrls = buildNyaaDownloadUrls(parsedTarget, ids)
                res.statusCode = 200
                res.setHeader("Content-Type", "text/plain; charset=utf-8")
                res.setHeader("X-Scrape-Fallback", "nyaa-html-view-download-urls")
                res.end(downloadUrls)
                return
              }
            }
          }

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
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), scrapeProxyPlugin(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})