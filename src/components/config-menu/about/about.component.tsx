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
        src="images/one-pace-logo.webp"
        alt="One Pace Logo"
        loading="lazy"
        className="w-full max-w-full object-contain"
      />

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
            As legendas são mantidas em um repositorio a parte, pensando em
            manutenção e organização. Caso haja erros nas legendas, ou ainda não
            possua legendas para os ultimos episodios do One Pace para arcos em
            andamento, você pode ajudar abrindo um pull request no repositorio.
            Rotineiramente, podemos pegar as legendas em outros idiomas e
            converte-las para português com o auxilio de IA, mas tenha em mente
            que isso pode gerar erros de tradução então, se for submeter as
            legendas, realize uma revisão minima para garantir a melhor
            experiencia para todos. Abaixo alguns locais para extrair legendas
            em outros idiomas.
            <div className="flex w-full flex-col gap-2 p-3 text-sm">
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
            O One Pace BR é um hub unificado criado para facilitar o acesso ao
            projeto One Pace. Centralizamos o conteúdo e as legendas em
            português em um só lugar, eliminando a necessidade de buscas
            externas ou trackers de torrent. Desenvolvido com foco na
            experiência do usuário por Shouldz.
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
          Repositorio das Legendas One Pace BR Hub
        </Button>
      </ButtonGroup>
    </>
  )
}

export default AboutComponent
