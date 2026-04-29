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
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field"
import type { IWelcomeModalComponentProps } from "../types"

const WelcomeModalComponent = ({
  handleCloseWelcomeModal,
  renderModalOnePaceWelcome,
}: IWelcomeModalComponentProps) => {
  return (
    <Dialog
      open={renderModalOnePaceWelcome}
      onOpenChange={handleCloseWelcomeModal}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="flex flex-col gap-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <img
              src="images/one-pace-logo.webp"
              alt="One Pace Logo"
              loading="lazy"
              className="w-200 object-contain"
            />
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-4">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>O que é o One Pace?</FieldTitle>
                <FieldDescription>
                  One Pace é um projeto de fãs que reedita o anime One Piece
                  para ficar mais alinhado ao ritmo do mangá original de
                  Eiichiro Oda. A equipe realiza isso removendo cenas de filler
                  não presentes no material original, corrigindo erros de
                  animação e ajustando legendas.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>O que é o One Pace BR Hub?</FieldTitle>
                <FieldDescription>
                  Esse projeto é um agregador de legendas para o projeto One
                  Pace. O projeto possui legendas hospedadas no Github, você
                  pode encontrar esse repositorio no menu do site. Você pode
                  colaborar com as legendas, caso as ultimas legendas dos
                  episodios mais recentes não estejam disponiveis, ou mesmo
                  corrigir alguma legenda que esteja com erro. Para isso, basta
                  abrir um Pull Request no repositorio do Github.
                </FieldDescription>
              </FieldContent>
            </Field>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default WelcomeModalComponent
