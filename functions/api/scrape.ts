

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
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    })

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
