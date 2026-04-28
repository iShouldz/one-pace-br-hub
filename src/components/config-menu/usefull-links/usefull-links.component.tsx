import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import useNavigation from "@/hooks/use-navigation/use-navigation"
import { Album } from "lucide-react"

const sectionData = [
  {
    id: "form-feedback-1",
    title: "Manga Scene",
    buttonText: "Visitar o site",
    buttonLink: "https://www.mangascene.com/pt/manga/one-piece-portugues.html",
  },
  {
    id: "form-feedback-3",
    title: "One Piece Project",
    buttonText: "Visitar o site",
    buttonLink: "https://scan.onepieceproject.com.br/?Capitulo=1181",
  },
  {
    id: "form-feedback-2",
    title: "Manga Plus (Oficial)",
    buttonText: "Visitar o site",
    buttonLink: "https://mangaplus.shueisha.co.jp/titles/100149",
  },
]

const UsefullLinksComponent = () => {
  const { handleRedirect } = useNavigation()
  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h2 className="text-md font-semibold">Ler mangá online</h2>
        <p className="text-xs text-muted-foreground">
          Links onde você pode encontrar o mangá de One Piece para ler online,
          com as traduções mais rápidas.
        </p>
      </header>

      <div>
        <FieldGroup className="w-full gap-2">
          {sectionData.map((item) => (
            <Item variant={"outline"}>
              <ItemMedia variant="icon">
                <Album />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button onClick={() => handleRedirect(item.buttonLink)}>
                  {item.buttonText}
                </Button>
              </ItemActions>
            </Item>
          ))}
        </FieldGroup>
      </div>
    </section>
  )
}

export default UsefullLinksComponent
