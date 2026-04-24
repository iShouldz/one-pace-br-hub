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
            <div>
              <h4 className="mb-2 font-medium text-zinc-900 dark:text-zinc-200">
                Como habilitar no qBittorrent:
              </h4>
              <ol className="list-inside list-decimal space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  Vá em{" "}
                  <strong className="text-zinc-900 dark:text-zinc-300">
                    Ferramentas {">"} Opções {">"} Interface Web
                  </strong>
                  .
                </li>
                <li>
                  Marque a opção{" "}
                  <strong className="text-zinc-900 dark:text-zinc-300">
                    "Habilitar Interface Web"
                  </strong>
                  .
                </li>
                <li>
                  Defina o IP (geralmente{" "}
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                    127.0.0.1
                  </code>{" "}
                  na porta{" "}
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                    8080
                  </code>
                  ), Usuário e Senha.
                </li>
                <li>
                  Insira esses mesmos dados nos campos do nosso formulário.
                </li>
              </ol>
            </div>

            <Item variant="muted">
              <ItemMedia variant="icon">
                <InfoIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Privacidade 100% Local</ItemTitle>
                <ItemDescription className="wrap-break-words text-ellipsis-none! overflow-visible! text-wrap! whitespace-pre-line">
                  Este Hub não possui banco de dados em nuvem. Suas credenciais
                  e seu IP são salvos{" "}
                  <strong>apenas no seu próprio navegador</strong> (via{" "}
                  localStorage ). Nenhuma informação é enviada para a internet.
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
                placeholder=" Ex: http://localhost:8080"
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
