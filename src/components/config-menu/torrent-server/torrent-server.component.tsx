import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { StorageKeys } from "@/utils/storage-keys.utils"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
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
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h2 className="text-md font-semibold">Provedor torrent</h2>
        <p className="text-xs text-muted-foreground">
          Configure seu provedor torrent para baixar os episódios
          automaticamente diretamente no seu provedor. Atualmente, apenas o
          qBittorrent é suportado, mas futuramente planejamos adicionar suporte
          para outros provedores.
        </p>
      </header>

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
