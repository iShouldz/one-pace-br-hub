import BackgroundHeaderComponent from "@/components/background-header/background-header.component"
import { Button } from "@/components/ui/button"

type ErrorViewProps = {
  title?: string
  description?: string
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

const ErrorView = ({
  title = "Algo deu errado",
  description = "Não conseguimos carregar está página agora.",
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: ErrorViewProps) => {
  return (
    <BackgroundHeaderComponent
      direction="left"
      imageUrl="/images/wallpaper-background.webp"
    >
      <main className="absolute inset-0 overflow-y-auto">
        <section className="mx-auto flex min-h-screen w-full max-w-360 flex-col items-center justify-center px-6 py-10 md:px-10 lg:px-16">
          <article className="w-full max-w-2xl rounded-3xl border border-black/10 bg-white/65 p-6 text-center shadow-2xl shadow-black/15 backdrop-blur-md sm:p-10 dark:border-white/10 dark:bg-black/45 dark:shadow-black/40">
            <div className="flex flex-col items-center gap-4">
              <img src="/images/one-pace-logo.webp" alt="One Pace Logo" />
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {primaryActionLabel && onPrimaryAction && (
                  <Button size="lg" onClick={onPrimaryAction}>
                    {primaryActionLabel}
                  </Button>
                )}
                {secondaryActionLabel && onSecondaryAction && (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={onSecondaryAction}
                  >
                    {secondaryActionLabel}
                  </Button>
                )}
              </div>
            </div>
          </article>
        </section>
      </main>
    </BackgroundHeaderComponent>
  )
}

export default ErrorView
