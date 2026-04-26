# One Pace BR Hub

Hub brasileiro com organização de sagas/arcos do One Pace e suporte a legendas PT-BR.

## Executar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run typecheck
npm run build
```

## SEO e indexacao (ja implementado)

- Metadados dinamicos por rota (home, saga e arco).
- Canonical dinamico por URL.
- Open Graph e Twitter Cards dinamicos.
- JSON-LD basico por pagina.
- `robots.txt` com sitemap declarado.
- `sitemap.xml` com home, paginas de saga e principais paginas East Blue.
- Fallback SPA para Cloudflare Pages via `public/_redirects`.

## Configuracao obrigatoria de dominio

Defina o dominio oficial em variavel de ambiente para gerar canonicals absolutos corretos:

```bash
VITE_SITE_URL=https://seu-dominio.com
```

No Cloudflare Pages:

1. Acesse Project > Settings > Environment variables.
2. Crie `VITE_SITE_URL` para `Production` (e `Preview`, se quiser).
3. Faça novo deploy.

## Passos manuais para indexar no Google

1. Garanta que o site esta publico e sem login.
2. Confirme que estas URLs abrem normalmente:
	- `/robots.txt`
	- `/sitemap.xml`
	- `/saga/east-blue`
3. No Google Search Console:
	- Adicione a propriedade do dominio.
	- Envie o sitemap: `https://seu-dominio.com/sitemap.xml`.
	- Use "Inspecao de URL" e solicite indexacao para:
	  - home
	  - `/saga/east-blue`
	  - 3-5 sagas principais
4. Aguarde rastreamento (normalmente alguns dias).

## Observacao importante

Os arquivos `public/robots.txt` e `public/sitemap.xml` usam o dominio `https://one-pace-br-hub.pages.dev` como padrao. Se voce usar dominio customizado, atualize esses arquivos para o dominio final antes de publicar.
