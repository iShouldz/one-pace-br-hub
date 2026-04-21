import { useCallback } from "react"
import { toast } from "sonner"

const useTorrent = () => {
  const extractMagnetLinks = (html: string): string[] => {
    const magnetRegex = /magnet:\?[^"'\s<>]+/g
    const matches = html.match(magnetRegex) || []
    const normalized = matches.map((link) => link.replace(/&amp;/g, "&"))
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
  return { extractMagnetLinks, fetchPageContent, tryCopyMagnetsToClipboard }
}

export default useTorrent
