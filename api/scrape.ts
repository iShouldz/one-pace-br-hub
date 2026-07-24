const BLOCKED_STATUSES = new Set([401, 403, 429, 503])
const RETRYABLE_STATUSES = new Set([429, 503])
const DEFAULT_MAX_RSS_PAGES = 4
const MAX_RSS_PAGES_HARD_LIMIT = 8

const NYAA_HOSTS = new Set([
  "nyaa.si",
  "www.nyaa.si",
  "sukebei.nyaa.si",
  "www.sukebei.nyaa.si",
])

const buildHeaders = (target: URL, mode: "html" | "rss" = "html") => {
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

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const parseRetryAfterMs = (retryAfterHeader: string | null): number => {
  if (!retryAfterHeader) return 0

  const seconds = Number(retryAfterHeader)
  if (!Number.isNaN(seconds) && seconds > 0) {
    return seconds * 1000
  }

  const dateMs = Date.parse(retryAfterHeader)
  if (!Number.isNaN(dateMs)) {
    return Math.max(0, dateMs - Date.now())
  }

  return 0
}

const fetchWithRetry = async (
  input: string,
  init: RequestInit,
  retries = 2
): Promise<Response> => {
  let lastResponse: Response | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(input, init)
    lastResponse = response

    if (!RETRYABLE_STATUSES.has(response.status) || attempt === retries) {
      return response
    }

    const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"))
    const backoffMs = Math.min(1000 * (attempt + 1), 3000)
    await sleep(Math.max(retryAfterMs, backoffMs))
  }

  return lastResponse as Response
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
  )
}

const extractInfoHash = (itemXml: string): string => {
  return (
    itemXml.match(/<nyaa:infoHash>([a-fA-F0-9]{40})<\/nyaa:infoHash>/)?.[1] ||
    ""
  )
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
  maxPages = DEFAULT_MAX_RSS_PAGES
): Promise<string | null> => {
  const allItems: string[] = []
  const seenHashes = new Set<string>()
  const safeMaxPages = Math.max(1, Math.min(MAX_RSS_PAGES_HARD_LIMIT, maxPages))

  for (let page = 1; page <= safeMaxPages; page++) {
    const rssUrl = getNyaaRssUrlByPage(parsedTarget, page)
    const rssResponse = await fetchWithRetry(
      rssUrl.toString(),
      {
        method: "GET",
        redirect: "follow",
        headers: buildHeaders(parsedTarget, "rss"),
      },
      2
    )

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

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Metodo nao permitido" })
    return
  }

  const targetUrl = req.query?.url

  if (!targetUrl || typeof targetUrl !== "string") {
    res.status(400).json({ error: "Parametro 'url' e obrigatorio" })
    return
  }

  let parsedTarget: URL
  try {
    parsedTarget = new URL(targetUrl)
  } catch {
    res.status(400).json({ error: "URL invalida" })
    return
  }

  if (!["http:", "https:"].includes(parsedTarget.protocol)) {
    res.status(400).json({ error: "Somente URLs http/https sao permitidas" })
    return
  }

  const pagesParam = Number(req.query?.pages || "")
  const requestedPages = Number.isFinite(pagesParam)
    ? pagesParam
    : DEFAULT_MAX_RSS_PAGES

  const isNyaaHost = NYAA_HOSTS.has(parsedTarget.hostname)
  const hasSearchQuery = Boolean(parsedTarget.searchParams.get("q"))

  try {
    if (isNyaaHost) {
      const viewTorrentUrl = getNyaaViewTorrentUrl(parsedTarget)
      if (viewTorrentUrl) {
        res.status(200)
        res.setHeader("Content-Type", "text/plain; charset=utf-8")
        res.setHeader("X-Scrape-Fallback", "nyaa-view-download-url")
        res.send(viewTorrentUrl)
        return
      }

      if (hasSearchQuery) {
        const rssXml = await fetchNyaaAggregatedRss(
          parsedTarget,
          requestedPages
        )
        if (rssXml) {
          res.status(200)
          res.setHeader("Content-Type", "application/rss+xml; charset=utf-8")
          res.setHeader("X-Scrape-Fallback", "nyaa-rss-aggregated")
          res.send(rssXml)
          return
        }

        const htmlFallbackResponse = await fetchWithRetry(
          parsedTarget.toString(),
          {
            method: "GET",
            redirect: "follow",
            headers: buildHeaders(parsedTarget, "html"),
          },
          2
        )

        if (htmlFallbackResponse.ok) {
          const html = await htmlFallbackResponse.text()
          const ids = extractNyaaViewIds(html)

          if (ids.length) {
            const downloadUrls = buildNyaaDownloadUrls(parsedTarget, ids)
            res.status(200)
            res.setHeader("Content-Type", "text/plain; charset=utf-8")
            res.setHeader("X-Scrape-Fallback", "nyaa-html-view-download-urls")
            res.send(downloadUrls)
            return
          }
        }

        res.status(503).json({
          error:
            "Nenhum torrent encontrado na busca ou Nyaa limitou as requisicoes",
        })
        return
      }
    }

    const response = await fetchWithRetry(
      parsedTarget.toString(),
      {
        method: "GET",
        redirect: "follow",
        headers: buildHeaders(parsedTarget, "html"),
      },
      2
    )

    if (BLOCKED_STATUSES.has(response.status) && isNyaaHost) {
      const viewTorrentUrl = getNyaaViewTorrentUrl(parsedTarget)
      if (viewTorrentUrl) {
        res.status(200)
        res.setHeader("Content-Type", "text/plain; charset=utf-8")
        res.setHeader("X-Scrape-Fallback", "nyaa-view-download-url")
        res.send(viewTorrentUrl)
        return
      }

      const rssXml = await fetchNyaaAggregatedRss(parsedTarget, requestedPages)
      if (rssXml) {
        res.status(200)
        res.setHeader("Content-Type", "application/rss+xml; charset=utf-8")
        res.setHeader("X-Scrape-Fallback", "nyaa-rss-aggregated")
        res.send(rssXml)
        return
      }

      const htmlFallbackResponse = await fetchWithRetry(
        parsedTarget.toString(),
        {
          method: "GET",
          redirect: "follow",
          headers: buildHeaders(parsedTarget, "html"),
        },
        2
      )

      if (htmlFallbackResponse.ok) {
        const html = await htmlFallbackResponse.text()
        const ids = extractNyaaViewIds(html)

        if (ids.length) {
          const downloadUrls = buildNyaaDownloadUrls(parsedTarget, ids)
          res.status(200)
          res.setHeader("Content-Type", "text/plain; charset=utf-8")
          res.setHeader("X-Scrape-Fallback", "nyaa-html-view-download-urls")
          res.send(downloadUrls)
          return
        }
      }
    }

    const html = await response.text()
    res.status(response.status)
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.send(html)
  } catch (error: any) {
    res.status(500).json({
      error: `Erro no scrape: ${error?.message || "desconhecido"}`,
    })
  }
}
