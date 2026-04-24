import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { StorageKeys } from "@/utils/storage-keys.utils"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import { InfoIcon } from "lucide-react"

import { useCallback, useState } from "react"
import { toast } from "sonner"

const TorrentServerComponent = () => {
  const [qbittorrentUrl, setQbittorrentUrl] = useState(
    getFromLocalStorage(StorageKeys.QBITTORRENT_CONFIG)?.baseUrl || ""
  )
  const [qbittorrentUsername, setQbittorrentUsername] = useState(
    getFromLocalStorage(StorageKeys.QBITTORRENT_CONFIG)?.username || ""
  )
  const [qbittorrentPassword, setQbittorrentPassword] = useState(
    getFromLocalStorage(StorageKeys.QBITTORRENT_CONFIG)?.password || ""
  )
  const [qbittorrentDownloadPath, setQbittorrentDownloadPath] = useState(
    getFromLocalStorage(StorageKeys.QBITTORRENT_CONFIG)?.savePath || ""
  )

  const [openModalQbittorrent, setOpenModalQbittorrent] = useState(false)

  const handleToggleModalQbittorrent = useCallback(() => {
    setOpenModalQbittorrent((prev) => !prev)
  }, [])

  const handleSaveConfig = useCallback(() => {
    const config = {
      baseUrl: qbittorrentUrl,
      username: qbittorrentUsername,
      password: qbittorrentPassword,
      savePath: qbittorrentDownloadPath,
    }

    if (
      !qbittorrentUrl ||
      !qbittorrentUsername ||
      !qbittorrentPassword ||
      !qbittorrentDownloadPath
    ) {
      toast("Erro ao salvar configurações", {
        description: "Por favor, preencha todos os campos obrigatórios.",
      })
      return
    }

    saveToLocalStorage(StorageKeys.QBITTORRENT_CONFIG, config)

    toast("Dados do provedor torrent salvos", {
      description:
        "Seus dados de configuração do provedor torrent foram salvos com sucesso. Agora, quando você baixar episódios, eles serão enviados para o provedor torrent configurado.",
    })
  }, [
    qbittorrentUrl,
    qbittorrentUsername,
    qbittorrentPassword,
    qbittorrentDownloadPath,
  ])

  const handleClearConfig = useCallback(() => {
    setQbittorrentUrl("")
    setQbittorrentUsername("")
    setQbittorrentPassword("")
    setQbittorrentDownloadPath("")

    saveToLocalStorage(StorageKeys.QBITTORRENT_CONFIG, {
      baseUrl: "",
      username: "",
      password: "",
      savePath: "",
    })

    toast("Dados do provedor torrent removidos", {
      description:
        "Seus dados de configuração do provedor torrent foram removidos com sucesso.",
    })
  }, [])

  return (
    <section className="flex flex-col gap-3">
      <header className="flex flex-col gap-1">
        <h2 className="text-md font-semibold">Provedor torrent</h2>
        <p className="text-xs text-muted-foreground">
          Configure seu provedor torrent para baixar os episódios
          automaticamente diretamente no seu provedor. Atualmente, apenas o
          qBittorrent é suportado, mas futuramente planejamos adicionar suporte
          para outros provedores.
        </p>
      </header>

      <Dialog
        open={openModalQbittorrent}
        onOpenChange={handleToggleModalQbittorrent}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="flex flex-col gap-6 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Integração com qBittorrent</DialogTitle>
            <DialogDescription className="flex flex-col gap-4">
              Para agilizar a montagem do seu catálogo, você pode conectar este
              Hub diretamente ao seu qBittorrent. Com isso ativado, ao clicar em
              "Baixar Torrent" num arco, o download inicia automaticamente no
              seu cliente, sem precisar baixar o arquivo .torrent e abri-lo
              manualmente.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h4 className="mb-1 text-sm font-medium text-amber-800 dark:text-amber-400">
                  Requisito de Rede: Acesso Externo
                </h4>
                <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-500/90">
                  Como este Hub está hospedado na nuvem, ele{" "}
                  <strong>
                    não consegue acessar o seu{" "}
                    <code className="rounded bg-amber-100 px-1 text-xs dark:bg-amber-900/50">
                      localhost
                    </code>{" "}
                    (127.0.0.1)
                  </strong>
                  . Para que a integração funcione, sua Interface Web do
                  qBittorrent precisa estar exposta para a internet.
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium text-zinc-900 dark:text-zinc-200">
                Como configurar (Para usuários avançados):
              </h4>
              <ol className="list-inside list-decimal space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  No qBittorrent, habilite a{" "}
                  <strong className="text-zinc-900 dark:text-zinc-300">
                    Interface Web
                  </strong>{" "}
                  nas Opções de Ferramentas.
                </li>
                <li>
                  Utilize uma ferramenta de tunelamento segura (como{" "}
                  <strong className="text-zinc-900 dark:text-zinc-300">
                    Cloudflare Tunnels
                  </strong>
                  ,{" "}
                  <strong className="text-zinc-900 dark:text-zinc-300">
                    Tailscale
                  </strong>{" "}
                  ou DDNS) para gerar uma URL pública.
                </li>
                <li>
                  Insira a sua URL gerada (ex:{" "}
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs break-all dark:bg-zinc-800">
                    https://qbit.seu-dominio.com
                  </code>
                  ), Usuário e Senha abaixo.
                </li>
              </ol>
            </div>

            <Item variant="muted">
              <ItemMedia variant="icon">
                <InfoIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Como lidamos com seus dados</ItemTitle>
                <ItemDescription className="wrap-break-words text-ellipsis-none! overflow-visible! text-wrap! whitespace-pre-line">
                  Não possuímos banco de dados. Suas credenciais são guardadas
                  estritamente no{" "}
                  <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">
                    localStorage
                  </code>{" "}
                  do seu navegador. Elas são enviadas de forma transitória à
                  nossa API serverless apenas no momento do disparo do download,
                  sem geração de logs.
                </ItemDescription>
              </ItemContent>
            </Item>
          </div>
        </DialogContent>
      </Dialog>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>O que é essa integração?</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleModalQbittorrent}
          >
            Saiba mais
          </Button>
        </ItemActions>
      </Item>
      <aside>
        <FieldSet className="w-full">
          <FieldGroup className="gap-5">
            <Field className="gap-1">
              <FieldLabel htmlFor="username">Qbittorrent url</FieldLabel>
              <Input
                id="username"
                type="text"
                placeholder=" Ex: https://qbit.seu-dominio.com"
                value={qbittorrentUrl}
                onChange={(e) => setQbittorrentUrl(e.target.value)}
              />
              <FieldDescription></FieldDescription>
            </Field>
            <Field className="flex gap-1">
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <FieldDescription>Usuario do qbittorrent</FieldDescription>
              <Input
                id="username"
                type="text"
                placeholder=" Ex: admin"
                value={qbittorrentUsername}
                onChange={(e) => setQbittorrentUsername(e.target.value)}
              />
            </Field>
            <Field className="flex gap-1">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <FieldDescription>Senha do qbittorrent</FieldDescription>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={qbittorrentPassword}
                onChange={(e) => setQbittorrentPassword(e.target.value)}
              />
            </Field>
            <Field className="flex gap-1">
              <FieldLabel htmlFor="downloadPath">
                Caminho padrão de download
              </FieldLabel>
              <FieldDescription>
                Caminho onde os arquivos serão baixados
              </FieldDescription>
              <Input
                id="downloadPath"
                type="text"
                placeholder=" Ex: C:\Users\download\jellyfin\animes"
                value={qbittorrentDownloadPath}
                onChange={(e) => setQbittorrentDownloadPath(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <ButtonGroup>
            <Button onClick={handleSaveConfig}>Salvar configurações</Button>
            <Button onClick={handleClearConfig}>Limpar campos</Button>
          </ButtonGroup>
        </FieldSet>
      </aside>
    </section>
  )
}

export default TorrentServerComponent
