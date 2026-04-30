import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import useNavigation from "@/hooks/use-navigation/use-navigation"

const sectionData = [
  {
    id: "stremio-addon-op",
    title: "One Pace Addon",
    description: "Official One Pace addon for Stremio.",
    buttonText: "Acessar",
    buttonLink: "https://stremio-addons.net/addons/one-pace-addon",
  },
  {
    id: "stremio-addon-pt-bt",
    title: "One Pace PT-BR Subs",
    description: "Legendas em Português do Brasil para o One Pace.",
    buttonText: "Acessar",
    buttonLink: "https://stremio-addons.net/addons/one-pace-pt-br-subs",
  },
]

const StremioComponent = ({}) => {
  const { handleRedirect } = useNavigation()

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h2 className="text-md font-semibold">Stremio Addon</h2>
        <p className="text-xs text-muted-foreground">
          O Projeto One Pace possui Addon oficial para o Stremio. Para a
          comunidade PT-BR o{" "}
          <a
            href="https://www.reddit.com/user/rafaelmotac"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            rafaelmotac
          </a>{" "}
          criou um addon não oficial, mas que é atualizado regularmente, com as
          legendas em português para o One Pace PT-BR.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {sectionData.map((item) => (
          <Item variant={"outline"}>
            <ItemMedia variant="icon">
              <img
                src="/images/icons/stremio.webp"
                alt="stremio"
                className="size-4.5 opacity-80 grayscale"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button onClick={() => handleRedirect(item.buttonLink)}>
                {item.buttonText}
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </section>
  )
}

export default StremioComponent
