import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  ArrowUpRight,
  CopyIcon,
  DownloadIcon,
  InfoIcon,
  Search,
  WavesArrowDown,
} from "lucide-react"
import type { IScrappingModalProps } from "../types"

const ScrappingModalComponent = ({
  arcId,
  sagaId,
  magnetLinks,
  hasDriveDownload,
  isLoadingMagnets,
  qbittorrentConfig,
  manualDownloadLink,
  handleSendToQbittorrent,
  handleRedirectButtonAction,
  handleCopyMagnetLinksClick,
  handleDownloadEpisodesAndMarkDone,
}: IScrappingModalProps) => {
  return (
    <Dialog>
      {!hasDriveDownload && (
        <DialogTrigger asChild>
          <Button size="lg">
            <DownloadIcon /> Episodios
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="flex flex-col gap-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Scrapping</DialogTitle>
          <DialogDescription className="flex flex-col gap-4">
            Esse arco provavelmente nao esta concluido ou nao foi feito um
            bundle unico. Vamos fazer o scrapping dos episodios para facilitar o
            download massivo dos episodios para voce. Caso selecione o download
            multiplo, adicionaremos ao seu clipboard os links torrents.
            <Item variant="muted">
              <ItemMedia variant="icon">
                <InfoIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>O que e scrapping?</ItemTitle>
                <ItemDescription className="wrap-break-words text-ellipsis-none! overflow-visible! text-wrap! whitespace-pre-line">
                  O scraping de site torrent e o processo automatizado de
                  extracao de dados (como titulos, links magnet, tamanhos de
                  arquivo e contagem de seeds/peers) de plataformas de
                  compartilhamento P2P, como YTS, 1337x e Nyaa.si.
                </ItemDescription>
              </ItemContent>
            </Item>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full flex-col gap-4">
            {magnetLinks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Links encontrados. Voce pode copiar automaticamente ou
                  manualmente:
                </p>
                <textarea
                  className="min-h-32 w-full rounded-md border border-border/60 bg-background/70 p-2 text-xs text-foreground sm:p-3 sm:text-sm"
                  readOnly
                  value={magnetLinks.join("\n")}
                />
                {qbittorrentConfig?.savePath && (
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Caminho de salvamento do Qbittorrent:{" "}
                    {qbittorrentConfig?.savePath}\{sagaId}\{arcId}
                  </p>
                )}
              </div>
            )}
            <ButtonGroup>
              {!hasDriveDownload && (
                <>
                  <Button
                    type="button"
                    onClick={handleDownloadEpisodesAndMarkDone}
                    disabled={isLoadingMagnets}
                  >
                    <Search />
                    {isLoadingMagnets ? "Buscando links..." : "Buscar links"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCopyMagnetLinksClick}
                    disabled={!magnetLinks.length}
                  >
                    <CopyIcon />
                    Copiar links
                  </Button>
                  {qbittorrentConfig?.baseUrl !== "" &&
                    qbittorrentConfig?.baseUrl !== undefined && (
                      <Button
                        type="button"
                        onClick={handleSendToQbittorrent}
                        disabled={!magnetLinks.length}
                      >
                        <WavesArrowDown />
                        Enviar para qBittorrent
                      </Button>
                    )}
                </>
              )}

              <Button
                type="button"
                disabled={!manualDownloadLink}
                onClick={() => handleRedirectButtonAction(manualDownloadLink)}
              >
                <ArrowUpRight />
                Download manual
              </Button>
            </ButtonGroup>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ScrappingModalComponent
