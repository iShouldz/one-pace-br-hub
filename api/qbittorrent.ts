interface IQbittorrentConfigPayload {
  baseUrl: string
  username: string
  password: string
  savePath?: string
}

interface IQbittorrentPayload {
  links: string[]
  config: IQbittorrentConfigPayload
}

const isValidHttpUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Metodo nao permitido" })
    return
  }

  const body = (req.body || {}) as IQbittorrentPayload
  const links = Array.isArray(body.links) ? body.links.filter(Boolean) : []
  const config = body.config

  if (!links.length) {
    res.status(400).json({ error: "Lista de links vazia" })
    return
  }

  if (!config?.baseUrl || !isValidHttpUrl(config.baseUrl)) {
    res.status(400).json({ error: "baseUrl invalida (use http/https)" })
    return
  }

  if (!config.username || !config.password) {
    res.status(400).json({ error: "Usuario e senha sao obrigatorios" })
    return
  }

  const normalizedBaseUrl = config.baseUrl.trim().replace(/\/+$/, "")

  try {
    const loginBody = new URLSearchParams({
      username: config.username,
      password: config.password,
    })

    const loginResponse = await fetch(
      `${normalizedBaseUrl}/api/v2/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: loginBody.toString(),
      }
    )

    if (!loginResponse.ok) {
      res.status(loginResponse.status).json({
        error: "Falha ao autenticar no qBittorrent",
      })
      return
    }

    const authText = (await loginResponse.text()).trim().toLowerCase()
    if (authText !== "ok.") {
      res.status(401).json({
        error: "Credenciais invalidas no qBittorrent",
      })
      return
    }

    const setCookieHeader = loginResponse.headers.get("set-cookie")
    const sidMatch = setCookieHeader?.match(/SID=([^;]+)/i)
    const sidCookie = sidMatch ? `SID=${sidMatch[1]}` : ""

    if (!sidCookie) {
      res.status(401).json({
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
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: sidCookie,
        },
        body: addBody.toString(),
      }
    )

    if (!addResponse.ok) {
      const errorText = await addResponse.text().catch(() => "")
      res.status(addResponse.status).json({
        error: "Falha ao adicionar torrents",
        detail: errorText,
      })
      return
    }

    res.status(200).json({ ok: true })
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao enviar torrents para o qBittorrent",
      detail: error?.message || "desconhecido",
    })
  }
}
