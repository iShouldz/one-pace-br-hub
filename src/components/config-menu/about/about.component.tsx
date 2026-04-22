import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { InfoIcon } from "lucide-react"

const AboutComponent = () => {
  return (
    <>
      <img
        src="/one-pace-logo.png"
        alt="One Pace Logo"
        loading="lazy"
        className="w-64 max-w-full object-contain sm:w-90 md:w-125"
      />
      <Item variant="muted">
        <ItemMedia variant="icon">
          <InfoIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sobre</ItemTitle>
          <ItemDescription>
            Projeto One Pace Br tem como objetivo agregar as legendas pt-br do
            projeto de fãs One Pace. Desenvolvido por Shouldz
          </ItemDescription>
        </ItemContent>
      </Item>
    </>
  )
}

export default AboutComponent
