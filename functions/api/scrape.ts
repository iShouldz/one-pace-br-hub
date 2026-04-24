
const BLOCKED_STATUSES = new Set([401, 403, 429, 503])
const RETRYABLE_STATUSES = new Set([429, 503])
const DEFAULT_MAX_RSS_PAGES = 4
const MAX_RSS_PAGES_HARD_LIMIT = 8
const CACHE_TTL_SECONDS = 300

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

const getStringEnv = (context: any, key: string): string => {
  const value = context?.env?.[key]
  if (typeof value !== "string") return ""
  return value.trim()
}

const normalizeContentType = (contentType: string | null): string => {
  if (!contentType?.trim()) return "text/plain; charset=utf-8"
  return contentType
}

const fetchFromUpstreamScraper = async (
  context: any,
  targetUrl: string,
  requestedPages: number
): Promise<{ body: string; contentType: string; fallbackHeader: string } | null> => {
  const upstreamBaseUrl = getStringEnv(context, "SCRAPE_UPSTREAM_URL")
  if (!upstreamBaseUrl) return null

  let parsedUpstream: URL
  try {
    parsedUpstream = new URL(upstreamBaseUrl)
  } catch {
    return null
  }

  parsedUpstream.pathname = parsedUpstream.pathname.replace(/\/+$/, "") + "/api/scrape"
  parsedUpstream.searchParams.set("url", targetUrl)
  parsedUpstream.searchParams.set("pages", String(requestedPages))

  const upstreamToken = getStringEnv(context, "SCRAPE_UPSTREAM_TOKEN")
  const headers: Record<string, string> = {
    accept: "application/rss+xml,application/xml,text/plain,text/html,*/*",
  }

  if (upstreamToken) {
    headers.authorization = `Bearer ${upstreamToken}`
  }

  const upstreamResponse = await fetchWithRetry(
    parsedUpstream.toString(),
    {
      method: "GET",
      redirect: "follow",
      headers,
    },
    1
  )

  if (!upstreamResponse.ok) {
    return null
  }

  const body = await upstreamResponse.text()
  if (!body.trim()) {
    return null
  }

  const contentType = normalizeContentType(
    upstreamResponse.headers.get("content-type")
  )
  const upstreamFallback =
    upstreamResponse.headers.get("x-scrape-fallback") || "unknown"

  return {
    body,
    contentType,
    fallbackHeader: `upstream-${upstreamFallback}`,
  }
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

  const safeMaxPages = Math.max(
    1,
    Math.min(MAX_RSS_PAGES_HARD_LIMIT, maxPages)
  )

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

    // Nyaa costuma retornar 75 resultados por pagina; menos que isso indica ultima pagina.
    if (pageItems.length < 75) {
      break
    }
  }

  if (!allItems.length) return null
  return buildMergedRss(allItems)
}

const buildCachedResponse = (
  body: string,
  contentType: string,
  fallbackHeader: string
): Response => {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "X-Scrape-Fallback": fallbackHeader,
      "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
    },
  })
}

export async function onRequest(context: any) {
  try {
    const { request } = context
    const url = new URL(request.url)
    const targetUrl = url.searchParams.get("url")

    if (!targetUrl) {
      return new Response("Parametro 'url' e obrigatorio", { status: 400 })
    }

    const pagesParam = Number(url.searchParams.get("pages") || "")
    const requestedPages = Number.isFinite(pagesParam)
      ? pagesParam
      : DEFAULT_MAX_RSS_PAGES

    const cacheKey = new Request(
      `${url.origin}/api/scrape-cache?url=${encodeURIComponent(targetUrl)}&pages=${requestedPages}`
    )

    const cache = (globalThis as any).caches?.default as Cache | undefined
    const cached = cache ? await cache.match(cacheKey) : null
    if (cached) {
      const headers = new Headers(cached.headers)
      headers.set("X-Scrape-Cache", "HIT")
      return new Response(cached.body, {
        status: cached.status,
        headers,
      })
    }

    let parsedTarget
    try {
      parsedTarget = new URL(targetUrl)
    } catch {
      return new Response("URL invalida", { status: 400 })
    }

    if (!["http:", "https:"].includes(parsedTarget.protocol)) {
      return new Response("Somente URLs http/https sao permitidas", {
        status: 400,
      })
    }

    const isNyaaHost = NYAA_HOSTS.has(parsedTarget.hostname)
    const hasSearchQuery = Boolean(parsedTarget.searchParams.get("q"))

    // Para URLs diretas /view/{id}, retorna o torrent direto
    if (isNyaaHost) {
      const viewTorrentUrl = getNyaaViewTorrentUrl(parsedTarget)
      if (viewTorrentUrl) {
        const response = buildCachedResponse(
          viewTorrentUrl,
          "text/plain; charset=utf-8",
          "nyaa-view-download-url"
        )
        if (cache) context.waitUntil?.(cache.put(cacheKey, response.clone()))
        return response
      }

      // Para queries (?q=...), sempre usa RSS (HTML de busca não serve)
      if (hasSearchQuery) {
        const upstreamResult = await fetchFromUpstreamScraper(
          context,
          parsedTarget.toString(),
          requestedPages
        )

        if (upstreamResult) {
          const response = buildCachedResponse(
            upstreamResult.body,
            upstreamResult.contentType,
            upstreamResult.fallbackHeader
          )
          if (cache) context.waitUntil?.(cache.put(cacheKey, response.clone()))
          return response
        }

        const rssXml = await fetchNyaaAggregatedRss(parsedTarget, requestedPages)
        if (rssXml) {
          const response = buildCachedResponse(
            rssXml,
            "application/rss+xml; charset=utf-8",
            "nyaa-rss-aggregated"
          )
          if (cache) context.waitUntil?.(cache.put(cacheKey, response.clone()))
          return response
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
            const response = buildCachedResponse(
              downloadUrls,
              "text/plain; charset=utf-8",
              "nyaa-html-view-download-urls"
            )
            if (cache) context.waitUntil?.(cache.put(cacheKey, response.clone()))
            return response
          }
        }

        // Se RSS falhar, retorna erro claro
        return new Response("Nenhum torrent encontrado na busca ou Nyaa limitou as requisicoes", {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        })
      }
    }

    // Para outras URLs (não-query), tenta buscar HTML normalmente
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
        const cachedResponse = buildCachedResponse(
          viewTorrentUrl,
          "text/plain; charset=utf-8",
          "nyaa-view-download-url"
        )
        if (cache) context.waitUntil?.(cache.put(cacheKey, cachedResponse.clone()))
        return cachedResponse
      }

      const rssXml = await fetchNyaaAggregatedRss(parsedTarget, requestedPages)

      if (rssXml) {
        const cachedResponse = buildCachedResponse(
          rssXml,
          "application/rss+xml; charset=utf-8",
          "nyaa-rss-aggregated"
        )
        if (cache) context.waitUntil?.(cache.put(cacheKey, cachedResponse.clone()))
        return cachedResponse
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
          const cachedResponse = buildCachedResponse(
            downloadUrls,
            "text/plain; charset=utf-8",
            "nyaa-html-view-download-urls"
          )
          if (cache) context.waitUntil?.(cache.put(cacheKey, cachedResponse.clone()))
          return cachedResponse
        }
      }

      return new Response("Nyaa temporariamente limitou as requisicoes (429)", {
        status: 429,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    const html = await response.text()

    const finalResponse = new Response(html, {
      status: response.status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    })

    if (response.ok) {
      if (cache) context.waitUntil?.(cache.put(cacheKey, finalResponse.clone()))
    }

    return finalResponse
  } catch (error: any) {
    return new Response(`Erro no scrape: ${error?.message || "desconhecido"}`, {
      status: 500,
    })
  }
}
