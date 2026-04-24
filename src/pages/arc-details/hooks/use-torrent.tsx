import { useCallback } from "react"
import { toast } from "sonner"

interface IQbittorrentConfig {
  baseUrl: string
  username: string
  password?: string
  savePath?: string
}

interface ISendToQbittorrentParams {
  links: string[]
  config: IQbittorrentConfig
}

interface INyaaRssEntry {
  title: string
  infoHash: string
  seeders: number
}

interface IStaticScrapeCache {
  generatedAt: string | null
  arcs: Record<
    string,
    {
      links?: string[]
      status?: string
      lastSuccessAt?: string | null
    }
  >
}

const STATIC_SCRAPE_CACHE_URL = "/data/scrape-cache.json"

const COMMON_TRACKERS = [
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://open.stealth.si:80/announce",
  "udp://tracker.torrent.eu.org:451/announce",
  "udp://tracker.dler.org:6969/announce",
  "udp://exodus.desync.com:6969/announce",
]

let staticCachePromise: Promise<IStaticScrapeCache | null> | null = null

const useTorrent = () => {
  const normalizeBaseUrl = (url: string): string => {
    return url.trim().replace(/\/+$/, "")
  }

  const isValidHttpUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url)
      return parsed.protocol === "http:" || parsed.protocol === "https:"
    } catch {
      return false
    }
  }

  const buildMagnetFromHash = (hash: string, title?: string): string => {
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

  const getEpisodeRange = (title: string): { start: number; end: number } | null => {
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

  const getEpisodeKey = (title: string): string => {
    const range = getEpisodeRange(title)
    if (!range) return title.trim().toLowerCase()
    return `${range.start}-${range.end}`
  }

  const getEntryScore = (entry: INyaaRssEntry): number => {
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

  const parseNyaaRssEntries = (xml: string): INyaaRssEntry[] => {
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

  const extractMagnetLinks = (html: string): string[] => {
    if (/<rss[\s\S]*?<channel>/i.test(html)) {
      const rssEntries = parseNyaaRssEntries(html)

      if (rssEntries.length) {
        const selectedByEpisode = new Map<string, INyaaRssEntry>()

        for (const entry of rssEntries) {
          const key = getEpisodeKey(entry.title)
          const current = selectedByEpisode.get(key)

          if (!current || getEntryScore(entry) > getEntryScore(current)) {
            selectedByEpisode.set(key, entry)
          }
        }

        const selected = [...selectedByEpisode.values()]
          .sort((a, b) => {
            const rangeA = getEpisodeRange(a.title)
            const rangeB = getEpisodeRange(b.title)

            if (!rangeA && !rangeB) return 0
            if (!rangeA) return 1
            if (!rangeB) return -1

            return rangeA.start - rangeB.start
          })
          .map((entry) => buildMagnetFromHash(entry.infoHash, entry.title))

        if (selected.length) {
          return selected
        }
      }
    }

    const magnetRegex = /magnet:\?[^"'\s<>]+/g
    const infoHashRegex = /<nyaa:infoHash>([a-fA-F0-9]{40})<\/nyaa:infoHash>/g
    const torrentUrlRegex = /https?:\/\/[^"'\s<>]+\.torrent(?:\?[^"'\s<>]*)?/g

    const magnetMatches = html.match(magnetRegex) || []
    const torrentUrlMatches = html.match(torrentUrlRegex) || []

    const rssInfoHashes = Array.from(html.matchAll(infoHashRegex)).map((match) =>
      buildMagnetFromHash(match[1])
    )

    const normalized = [...magnetMatches, ...rssInfoHashes, ...torrentUrlMatches].map(
      (link) => link.replace(/&amp;/g, "&")
    )

    return [...new Set(normalized)]
  }

  const fetchPageContent = async (url: string): Promise<string> => {
    const parsedUrl = new URL(url)
    const scrapeUrl = new URL("/api/scrape", window.location.origin)
    scrapeUrl.searchParams.set("url", parsedUrl.toString())

    const isNyaaQuery =
      parsedUrl.hostname.includes("nyaa.si") && parsedUrl.searchParams.has("q")

    if (isNyaaQuery) {
      const q = (parsedUrl.searchParams.get("q") || "").toLowerCase()
      const pages = q.includes("wano") || q.includes("egghead") ? "6" : "4"
      scrapeUrl.searchParams.set("pages", pages)
    }

    const response = await fetch(scrapeUrl.toString())
    if (!response.ok) {
      const err = await response.text().catch(() => "")
      throw new Error("Falha ao buscar página: " + (err || response.status))
    }
    return response.text()
  }

  const getCachedLinksForArc = useCallback(async (arcId?: string): Promise<string[]> => {
    if (!arcId) return []

    try {
      if (!staticCachePromise) {
        staticCachePromise = fetch(STATIC_SCRAPE_CACHE_URL, {
          cache: "no-store",
        })
          .then((response) => {
            if (!response.ok) return null
            return response.json() as Promise<IStaticScrapeCache>
          })
          .catch(() => null)
      }

      const cacheData = await staticCachePromise
      const entry = cacheData?.arcs?.[arcId]
      const links = Array.isArray(entry?.links)
        ? entry!.links!.filter((link) => typeof link === "string" && link.trim())
        : []

      if (!links.length) return []

      toast("Links carregados do cache comunitário", {
        description:
          "Usamos o índice estático atualizado via GitHub Actions para evitar bloqueios de scraping em tempo real.",
      })

      return [...new Set(links)]
    } catch {
      return []
    }
  }, [])

  const tryCopyMagnetsToClipboard = useCallback(async (links: string[]) => {
    if (!navigator.clipboard?.writeText) return false

    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({
          name: "clipboard-write" as PermissionName,
        })
        if (result.state === "denied") {
          toast("Permissão de clipboard negada", {
            description:
              "Permita o acesso ao clipboard para copiar automaticamente. Caso não consiga, copie manualmente os links.",
          })
          return false
        }

        if (result.state === "prompt") {
          try {
            await navigator.clipboard.writeText(links.join("\n"))
          } catch {
            toast("Permissão de clipboard não concedida", {
              description:
                "Permita o acesso ao clipboard ou copie manualmente os links.",
            })
            return false
          }
        }
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(links.join("\n"))
      toast("Torrents copiados com sucesso", {
        description:
          "Todos os torrents desse arco foram copiados com sucesso. Vá até o seu provedor de torrent (qbittorrent, deluge, etc) e cole os links para iniciar os downloads. Caso queira baixar manualmente ou tenha problemas com o scrapping, clique no botão de download manual para ser redirecionado à página de download do arco.",
      })
      return true
    } catch {
      return false
    }
  }, [])

  const sendMagnetsToQbittorrent = useCallback(
    async ({ links, config }: ISendToQbittorrentParams): Promise<boolean> => {
      if (!links.length) {
        toast("Nenhum torrent encontrado", {
          description: "Não há magnet links para enviar ao qBittorrent.",
        })
        return false
      }

      const baseUrl = normalizeBaseUrl(config.baseUrl)
      if (!isValidHttpUrl(baseUrl)) {
        toast("URL do qBittorrent invalida", {
          description: "Use uma URL http:// ou https:// valida.",
        })
        return false
      }

      if (!config.username?.trim() || !config.password?.trim()) {
        toast("Credenciais do qBittorrent ausentes", {
          description:
            "Preencha usuario e senha nas configuracoes do servidor torrent.",
        })
        return false
      }

      try {
        const response = await fetch("/api/qbittorrent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            links,
            config: {
              baseUrl,
              username: config.username,
              password: config.password,
              savePath: config.savePath,
            },
          }),
        })

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => null)

          if (response.status === 401) {
            toast("Falha ao autenticar no qBittorrent", {
              description:
                errorPayload?.error ||
                "Verifique usuario/senha e se o WebUI esta ativo.",
            })
            return false
          }

          toast("Falha ao autenticar no qBittorrent", {
            description:
              errorPayload?.error ||
              "Nao foi possivel conectar ao WebUI do qBittorrent.",
          })
          return false
        }

        toast("Torrents enviados ao qBittorrent", {
          description:
            "Os magnet links foram enviados para o provedor configurado e os downloads devem iniciar em breve.",
        })

        return true
      } catch (error) {
        console.error("Erro ao enviar torrents para o qBittorrent:", error)
        toast("Não foi possível enviar para o qBittorrent", {
          description:
            "Verifique se o WebUI esta ativo, URL correta, credenciais e certificado HTTPS valido.",
        })
        return false
      }
    },
    []
  )

  return {
    extractMagnetLinks,
    fetchPageContent,
    getCachedLinksForArc,
    tryCopyMagnetsToClipboard,
    sendMagnetsToQbittorrent,
  }
}

export default useTorrent
