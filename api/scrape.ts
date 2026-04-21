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

  try {
    const response = await fetch(parsedTarget.toString(), {
      method: "GET",
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    })

    const html = await response.text()
    res.status(response.status).setHeader("Content-Type", "text/html; charset=utf-8")
    res.send(html)
  } catch (error: any) {
    res.status(500).json({ error: `Erro no scrape: ${error?.message || "desconhecido"}` })
  }
}
