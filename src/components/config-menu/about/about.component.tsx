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
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { InfoIcon } from "lucide-react"

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
            Imagens dos banners:{" "}
            <a
              href="https://github.com/SpykerNZ/one-pace-for-plex"
              target="_blank"
              rel="noopener noreferrer"
            >
              One Pace for Plex (SpykerNZ)
            </a>
          </FieldDescription>
          <FieldDescription>
            Base de dados e agregador de legendas:{" "}
            <a
              href="https://onepaceptbr.github.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              One Pace PT-BR
            </a>
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
            handleRedirect("https://github.com/iShouldz/one-pace-br-hub-legendas")
          }
        >
          Repositorio das Legendas One Pace BR Hub
        </Button>
      </ButtonGroup>
    </>
  )
}

export default AboutComponent
