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

  const extractMagnetLinks = (html: string): string[] => {
    const magnetRegex = /magnet:\?[^"'\s<>]+/g
    const infoHashRegex = /<nyaa:infoHash>([a-fA-F0-9]{40})<\/nyaa:infoHash>/g
    const torrentUrlRegex = /https?:\/\/[^"'\s<>]+\.torrent(?:\?[^"'\s<>]*)?/g

    const magnetMatches = html.match(magnetRegex) || []
    const torrentUrlMatches = html.match(torrentUrlRegex) || []

    const rssInfoHashes = Array.from(html.matchAll(infoHashRegex)).map(
      (match) => `magnet:?xt=urn:btih:${match[1]}`
    )

    const normalized = [...magnetMatches, ...rssInfoHashes, ...torrentUrlMatches].map(
      (link) => link.replace(/&amp;/g, "&")
    )

    return [...new Set(normalized)]
  }

  const fetchPageContent = async (url: string): Promise<string> => {
    const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`)
    if (!response.ok) {
      const err = await response.text().catch(() => "")
      throw new Error("Falha ao buscar página: " + (err || response.status))
    }
    return response.text()
  }

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
    tryCopyMagnetsToClipboard,
    sendMagnetsToQbittorrent,
  }
}

export default useTorrent
