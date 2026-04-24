import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

const targetsPath = path.join(rootDir, "scripts", "scrape-targets.json")
const cacheOutputPath = path.join(rootDir, "public", "data", "scrape-cache.json")

const NYAA_HOSTS = new Set([
  "nyaa.si",
  "www.nyaa.si",
  "sukebei.nyaa.si",
  "www.sukebei.nyaa.si",
])

const COMMON_TRACKERS = [
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://open.stealth.si:80/announce",
  "udp://tracker.torrent.eu.org:451/announce",
  "udp://tracker.dler.org:6969/announce",
  "udp://exodus.desync.com:6969/announce",
]

const RETRYABLE_STATUSES = new Set([429, 503])

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const parseRetryAfterMs = (retryAfterHeader) => {
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

const fetchWithRetry = async (input, init, retries = 2) => {
  let lastResponse = null

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

  return lastResponse
}

const buildHeaders = (target, mode = "html") => {
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

const getNyaaViewTorrentUrl = (target) => {
  const match = target.pathname.match(/^\/view\/(\d+)\/?$/)
  if (!match) return null
  return `${target.origin}/download/${match[1]}.torrent`
}

const getNyaaRssUrlByPage = (target, page) => {
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

const getEpisodeRange = (title) => {
  const rangeMatch = title.match(/\[(\d{2,4})(?:-(\d{2,4}))?\]/)
  if (rangeMatch) {
    const start = Number(rangeMatch[1])
    const end = Number(rangeMatch[2] || rangeMatch[1])
    return { start, end }
  }

  const singleMatch = title.match(/\b(?:ep|episode)\s*(\d{2,4})\b/i)
  if (singleMatch) {
    const ep = Number(singleMatch[1])
    return { start: ep, end: ep }
  }

  return null
}

const getEpisodeKey = (title) => {
  const range = getEpisodeRange(title)
  if (!range) return title.trim().toLowerCase()
  return `${range.start}-${range.end}`
}

const getEntryScore = (entry) => {
  const title = entry.title.toLowerCase()
  let score = 0

  if (title.includes("one pace")) score += 30
  if (title.includes("1080p")) score += 20
  else if (title.includes("720p")) score += 10
  if (title.includes("x265") || title.includes("hevc")) score += 3
  if (title.includes("batch") || title.includes("bundle")) score += 5
  if (title.includes("dub")) score -= 5
  if (title.includes("vostfr") || title.includes("pt-br")) score += 1

  score += Math.min(entry.seeders, 50)

  return score
}

const buildMagnetFromHash = (hash, title) => {
  const params = new URLSearchParams()
  params.set("xt", `urn:btih:${hash}`)

  if (title?.trim()) {
    params.set("dn", title.trim())
  }

  for (const tracker of COMMON_TRACKERS) {
    params.append("tr", tracker)
  }

  return `magnet:?${params.toString()}`
}

const extractNyaaViewIds = (html) => {
  const ids = new Set()
  const viewIdRegex = /\/view\/(\d+)/g

  for (const match of html.matchAll(viewIdRegex)) {
    const id = match[1]
    if (id) ids.add(id)
  }

  return [...ids]
}

const parseNyaaRssEntries = (xml) => {
  const items = Array.from(xml.matchAll(/<item>[\s\S]*?<\/item>/g)).map(
    (match) => match[0]
  )

  return items
    .map((item) => {
      const title = (
        item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
        item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ||
        ""
      )
        .trim()
        .replace(/&amp;/g, "&")

      const infoHash = (
        item.match(/<nyaa:infoHash>([a-fA-F0-9]{40})<\/nyaa:infoHash>/)?.[1] ||
        ""
      ).trim()

      const seeders = Number(
        item.match(/<nyaa:seeders>(\d+)<\/nyaa:seeders>/)?.[1] || "0"
      )

      return { title, infoHash, seeders }
    })
    .filter((entry) => Boolean(entry.title && entry.infoHash))
}

const fetchNyaaAggregatedEntries = async (parsedTarget, maxPages) => {
  const allEntries = []
  const seenHashes = new Set()
  const safeMaxPages = Math.max(1, Math.min(8, maxPages || 4))

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

    if (!rssResponse.ok) break

    const rssXml = await rssResponse.text()
    const pageEntries = parseNyaaRssEntries(rssXml)

    if (!pageEntries.length) break

    for (const entry of pageEntries) {
      if (!seenHashes.has(entry.infoHash)) {
        seenHashes.add(entry.infoHash)
        allEntries.push(entry)
      }
    }

    if (pageEntries.length < 75) break
    await sleep(350)
  }

  return allEntries
}

const pickBestEntries = (entries) => {
  const selectedByEpisode = new Map()

  for (const entry of entries) {
    const key = getEpisodeKey(entry.title)
    const current = selectedByEpisode.get(key)

    if (!current || getEntryScore(entry) > getEntryScore(current)) {
      selectedByEpisode.set(key, entry)
    }
  }

  return [...selectedByEpisode.values()].sort((a, b) => {
    const rangeA = getEpisodeRange(a.title)
    const rangeB = getEpisodeRange(b.title)

    if (!rangeA && !rangeB) return 0
    if (!rangeA) return 1
    if (!rangeB) return -1

    return rangeA.start - rangeB.start
  })
}

const scrapeTarget = async (target) => {
  const parsedUrl = new URL(target.url)

  if (!NYAA_HOSTS.has(parsedUrl.hostname)) {
    return { links: [], via: "unsupported-host", message: "Host fora da lista" }
  }

  const viewTorrentUrl = getNyaaViewTorrentUrl(parsedUrl)
  if (viewTorrentUrl) {
    return { links: [viewTorrentUrl], via: "nyaa-view-download-url" }
  }

  const entries = await fetchNyaaAggregatedEntries(parsedUrl, target.pages || 4)
  const selectedEntries = pickBestEntries(entries)
  const magnets = selectedEntries.map((entry) =>
    buildMagnetFromHash(entry.infoHash, entry.title)
  )

  if (magnets.length) {
    return { links: [...new Set(magnets)], via: "nyaa-rss-aggregated" }
  }

  const htmlResponse = await fetchWithRetry(
    parsedUrl.toString(),
    {
      method: "GET",
      redirect: "follow",
      headers: buildHeaders(parsedUrl, "html"),
    },
    2
  )

  if (htmlResponse.ok) {
    const html = await htmlResponse.text()
    const ids = extractNyaaViewIds(html)
    if (ids.length) {
      const links = ids.map((id) => `${parsedUrl.origin}/download/${id}.torrent`)
      return { links, via: "nyaa-html-view-download-urls" }
    }
  }

  return { links: [], via: "empty", message: "Sem resultados" }
}

const readJson = async (filePath, fallback) => {
  try {
    const raw = await readFile(filePath, "utf-8")
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const main = async () => {
  const targets = await readJson(targetsPath, [])
  const existing = await readJson(cacheOutputPath, {
    generatedAt: null,
    source: "github-actions",
    arcs: {},
  })

  const next = {
    generatedAt: new Date().toISOString(),
    source: "github-actions",
    arcs: {},
  }

  let okCount = 0
  let failCount = 0

  for (const target of targets) {
    const startedAt = new Date().toISOString()

    try {
      const result = await scrapeTarget(target)
      const previous = existing?.arcs?.[target.arcId]

      const links = result.links.length ? result.links : previous?.links || []
      const status = result.links.length ? "ok" : previous?.links?.length ? "stale" : "error"

      if (status === "ok" || status === "stale") okCount += 1
      else failCount += 1

      next.arcs[target.arcId] = {
        arcId: target.arcId,
        title: target.title,
        sourceUrl: target.url,
        pages: target.pages || 4,
        links,
        linkCount: links.length,
        status,
        via: result.via,
        message: result.message || null,
        lastAttemptAt: startedAt,
        lastSuccessAt:
          status === "ok"
            ? startedAt
            : previous?.lastSuccessAt || null,
      }

      console.log(`[${status}] ${target.arcId} -> ${links.length} links (${result.via})`)
    } catch (error) {
      failCount += 1
      const previous = existing?.arcs?.[target.arcId]

      next.arcs[target.arcId] = {
        arcId: target.arcId,
        title: target.title,
        sourceUrl: target.url,
        pages: target.pages || 4,
        links: previous?.links || [],
        linkCount: previous?.links?.length || 0,
        status: previous?.links?.length ? "stale" : "error",
        via: "exception",
        message: error instanceof Error ? error.message : "erro desconhecido",
        lastAttemptAt: startedAt,
        lastSuccessAt: previous?.lastSuccessAt || null,
      }

      console.error(`[error] ${target.arcId}:`, error)
    }

    await sleep(500)
  }

  await mkdir(path.dirname(cacheOutputPath), { recursive: true })
  await writeFile(cacheOutputPath, `${JSON.stringify(next, null, 2)}\n`, "utf-8")

  console.log(`Finalizado. ok=${okCount} fail=${failCount}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
