const jsonResponse = (payload: any, status = 200) => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
}

export async function onRequestPost({ request }: any) {
  try {
    const body = await request.json()

    const links = Array.isArray(body?.links) ? body.links.filter(Boolean) : []
    const config = body?.config

    if (!links.length)
      return jsonResponse({ error: "Lista de links vazia" }, 400)
    if (!config?.baseUrl)
      return jsonResponse({ error: "baseUrl invalida" }, 400)
    if (!config.username || !config.password)
      return jsonResponse({ error: "Usuario e senha sao obrigatorios" }, 400)

    const normalizedBaseUrl = config.baseUrl.trim().replace(/\/+$/, "")

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

    if (!loginResponse.ok)
      return jsonResponse(
        { error: "Falha ao autenticar no qBittorrent" },
        loginResponse.status
      )

    const authText = (await loginResponse.text()).trim().toLowerCase()
    if (authText !== "ok.")
      return jsonResponse(
        { error: "Credenciais invalidas no qBittorrent" },
        401
      )

    const setCookieHeader = loginResponse.headers.get("set-cookie")
    const sidMatch = setCookieHeader?.match(/SID=([^;]+)/i)
    const sidCookie = sidMatch ? `SID=${sidMatch[1]}` : ""

    if (!sidCookie)
      return jsonResponse(
        { error: "Nao foi possivel obter sessao (cookie SID)" },
        401
      )

    const addBody = new URLSearchParams({ urls: links.join("\n") })
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
      return jsonResponse(
        { error: "Falha ao adicionar torrents", detail: errorText },
        addResponse.status
      )
    }

    return jsonResponse({ ok: true }, 200)
  } catch (error: any) {
    return jsonResponse(
      { error: "Erro interno no proxy do qBittorrent", detail: error?.message },
      500
    )
  }
}
