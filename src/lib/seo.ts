type SeoPayload = {
  title: string
  description: string
  path: string
  keywords?: string
  imagePath?: string
  type?: "website" | "article"
  jsonLd?: Record<string, unknown>
}

const DEFAULT_IMAGE_PATH = "/images/one-pace-logo.webp"

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/$/, "")

const getSiteUrl = () => {
  const envSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined
  if (envSiteUrl) {
    return normalizeBaseUrl(envSiteUrl)
  }

  if (typeof window !== "undefined") {
    return normalizeBaseUrl(window.location.origin)
  }

  return ""
}

const buildUrl = (path: string) => {
  const siteUrl = getSiteUrl()
  if (!siteUrl) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${siteUrl}${normalizedPath}`
}

const upsertMeta = ({
  selector,
  attribute,
  value,
  content,
}: {
  selector: string
  attribute: "name" | "property"
  value: string
  content: string
}) => {
  let meta = document.head.querySelector<HTMLMetaElement>(selector)

  if (!meta) {
    meta = document.createElement("meta")
    meta.setAttribute(attribute, value)
    document.head.appendChild(meta)
  }

  meta.setAttribute("content", content)
}

const upsertCanonical = (href: string) => {
  let canonical = document.head.querySelector<HTMLLinkElement>(
    "link[rel='canonical']"
  )

  if (!canonical) {
    canonical = document.createElement("link")
    canonical.setAttribute("rel", "canonical")
    document.head.appendChild(canonical)
  }

  canonical.setAttribute("href", href)
}

const upsertJsonLd = (jsonLd: Record<string, unknown>) => {
  const id = "seo-jsonld"
  let script = document.getElementById(id) as HTMLScriptElement | null

  if (!script) {
    script = document.createElement("script")
    script.id = id
    script.type = "application/ld+json"
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify(jsonLd)
}

export const setSeo = ({
  title,
  description,
  path,
  keywords,
  imagePath = DEFAULT_IMAGE_PATH,
  type = "website",
  jsonLd,
}: SeoPayload) => {
  const pageUrl = buildUrl(path)
  const imageUrl = buildUrl(imagePath)

  document.title = title

  upsertMeta({
    selector: "meta[name='description']",
    attribute: "name",
    value: "description",
    content: description,
  })

  if (keywords) {
    upsertMeta({
      selector: "meta[name='keywords']",
      attribute: "name",
      value: "keywords",
      content: keywords,
    })
  }

  upsertMeta({
    selector: "meta[name='robots']",
    attribute: "name",
    value: "robots",
    content: "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
  })

  upsertMeta({
    selector: "meta[name='googlebot']",
    attribute: "name",
    value: "googlebot",
    content: "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
  })

  upsertMeta({
    selector: "meta[property='og:type']",
    attribute: "property",
    value: "og:type",
    content: type,
  })

  upsertMeta({
    selector: "meta[property='og:title']",
    attribute: "property",
    value: "og:title",
    content: title,
  })

  upsertMeta({
    selector: "meta[property='og:description']",
    attribute: "property",
    value: "og:description",
    content: description,
  })

  upsertMeta({
    selector: "meta[property='og:url']",
    attribute: "property",
    value: "og:url",
    content: pageUrl,
  })

  upsertMeta({
    selector: "meta[property='og:image']",
    attribute: "property",
    value: "og:image",
    content: imageUrl,
  })

  upsertMeta({
    selector: "meta[name='twitter:card']",
    attribute: "name",
    value: "twitter:card",
    content: "summary_large_image",
  })

  upsertMeta({
    selector: "meta[name='twitter:title']",
    attribute: "name",
    value: "twitter:title",
    content: title,
  })

  upsertMeta({
    selector: "meta[name='twitter:description']",
    attribute: "name",
    value: "twitter:description",
    content: description,
  })

  upsertMeta({
    selector: "meta[name='twitter:image']",
    attribute: "name",
    value: "twitter:image",
    content: imageUrl,
  })

  upsertCanonical(pageUrl)

  if (jsonLd) {
    upsertJsonLd(jsonLd)
  }
}
