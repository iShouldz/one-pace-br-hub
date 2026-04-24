
const BLOCKED_STATUSES = new Set([401, 403, 429, 503])

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

const getNyaaViewTorrentUrl = (target: URL): string | null => {
  const match = target.pathname.match(/^\/view\/(\d+)\/?$/)
  if (!match) return null
  return `${target.origin}/download/${match[1]}.torrent`
}

const getNyaaRssUrl = (target: URL): URL => {
  const rssUrl = getNyaaRssUrlByPage(target, 1)

  return rssUrl
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
      headers: buildHeaders(parsedTarget, "rss"),
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

    // Nyaa costuma retornar 75 resultados por pagina; menos que isso indica ultima pagina.
    if (pageItems.length < 75) {
      break
    }
  }

  if (!allItems.length) return null
  return buildMergedRss(allItems)
}

export async function onRequest({ request }: any) {
  try {
    const url = new URL(request.url)
    const targetUrl = url.searchParams.get("url")

    if (!targetUrl) {
      return new Response("Parametro 'url' e obrigatorio", { status: 400 })
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

    const response = await fetch(parsedTarget.toString(), {
      method: "GET",
      redirect: "follow",
      headers: buildHeaders(parsedTarget, "html"),
    })

    if (BLOCKED_STATUSES.has(response.status) && NYAA_HOSTS.has(parsedTarget.hostname)) {
      const viewTorrentUrl = getNyaaViewTorrentUrl(parsedTarget)
      if (viewTorrentUrl) {
        return new Response(viewTorrentUrl, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "X-Scrape-Fallback": "nyaa-view-download-url",
          },
        })
      }

      const rssXml = await fetchNyaaAggregatedRss(parsedTarget)

      if (rssXml) {
        return new Response(rssXml, {
          status: 200,
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "X-Scrape-Fallback": "nyaa-rss-aggregated",
          },
        })
      }
    }

    const html = await response.text()

    return new Response(html, {
      status: response.status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*", 
      },
    })
  } catch (error: any) {
    return new Response(`Erro no scrape: ${error?.message || "desconhecido"}`, {
      status: 500,
    })
  }
}
