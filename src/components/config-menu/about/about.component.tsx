import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { ArrowUpRight, InfoIcon } from "lucide-react"

const AboutComponent = () => {
  const { handleRedirect } = useNavigation()
  return (
    <>
      <img
        src="/images/one-pace-logo.webp"
        alt="One Pace Logo"
        loading="lazy"
        className="w-full max-w-full object-contain"
      />
      <Item variant={"outline"}>
        <ItemContent>
          <ItemTitle>Shouldz</ItemTitle>
          <ItemDescription>Desenvolvedor</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              handleRedirect("https://github.com/iShouldz", {
                external: true,
              })
            }
          >
            Perfil <ArrowUpRight />
          </Button>
        </ItemActions>
      </Item>

      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Créditos e Fontes</FieldTitle>
          <FieldDescription>
            Inspiração para o projeto:{" "}
            <a
              href="https://onepaceptbr.github.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              One Pace PT-BR
            </a>
          </FieldDescription>
          <FieldDescription>
            Imagens dos banners:{" "}
            <a
              href="https://github.com/SpykerNZ/one-pace-for-plex"
              target="_blank"
              rel="noopener noreferrer"
            >
              One Pace for Plex (SpykerNZ)
            </a>
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Quero ajudar com as legendas</FieldTitle>
          <FieldDescription className="flex flex-col gap-2">
            Para garantir a organização e facilitar a manutenção, nossas
            legendas são hospedadas em um repositório exclusivo no GitHub. Caso
            encontre erros ou note a ausência de legendas em episódios recentes,
            sua contribuição é muito bem-vinda via Pull Request. Você pode
            agilizar o processo utilizando Inteligência Artificial ou a tradução
            automática do Subtitle Edit, mas lembre-se: a revisão humana é
            essencial. Como ferramentas automáticas podem se perder nos jargões
            e no contexto específico de One Piece, pedimos que revise o conteúdo
            antes de enviar. Abaixo, listamos fontes confiáveis de legendas em
            outros idiomas para iniciar sua tradução.
            <div className="flex w-full flex-col gap-2 p-3 text-sm">
              <dl className="flex items-center justify-between">
                <dt>Ferramenta para tradução</dt>
                <a
                  href="https://github.com/SubtitleEdit/subtitleedit/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Subtitle <ArrowUpRight />
                </a>
              </dl>
              <Separator />
              <dl className="flex items-center justify-between">
                <dt>1.</dt>
                <a
                  href="https://animetosho.org/search?q=one+pace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Anime Tosho <ArrowUpRight />
                </a>
              </dl>
              <Separator />
              <dl className="flex items-center justify-between">
                <dt>2.</dt>
                <a
                  href="https://github.com/one-pace/one-pace-public-subtitles/tree/main/main"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  One Pace Public Subtitles <ArrowUpRight />
                </a>
              </dl>
              <Separator />
            </div>
          </FieldDescription>
        </FieldContent>
      </Field>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <InfoIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sobre o Projeto</ItemTitle>
          <ItemDescription>
            O One Pace BR é um hub unificado criado para facilitar o acesso do
            público brasileiro e demais falantes da língua portuguesa ao projeto
            One Pace. Centralizamos o conteúdo e as legendas em PT-BR em um só
            lugar, eliminando a necessidade de buscas em sites externos ou
            garimpo em trackers de torrent.
          </ItemDescription>
        </ItemContent>
      </Item>

      <ButtonGroup>
        <Button
          onClick={() =>
            handleRedirect(
              "https://github.com/iShouldz/one-pace-br-hub-legendas"
            )
          }
        >
          Repositório das Legendas One Pace BR Hub
        </Button>
      </ButtonGroup>
    </>
  )
}

export default AboutComponent
