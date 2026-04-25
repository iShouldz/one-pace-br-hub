import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { StorageKeys } from "@/utils/storage-keys.utils"
import { getFromLocalStorage } from "@/utils/storage.utils"
import { useCallback, useState } from "react"

const sectionData = [
  {
    id: "listagem-sagas",
    title: "Listagem das sagas",
    description: "Alterne a ordem da lista de sagas.",
  },
  {
    id: "ocultar-sagas",
    title: "Ocultar sagas completas",
    description: "Oculte as sagas que já foram concluídas.",
  },
  {
    id: "escala-cinza",
    title: "Escala de cinza dos banners",
    description:
      "Remover o filtro de escala de cinza dos banners das sagas incompletas.",
  },
]

interface IShowComponentInterface {
  handleHideGrayscale: () => void
  handleToggleOrderList: () => void
  handleHideCompletedSagas: () => void
}

const ShowComponent = ({
  handleHideGrayscale,
  handleToggleOrderList,
  handleHideCompletedSagas,
}: IShowComponentInterface) => {
  const [switchStates, setSwitchStates] = useState(
    sectionData.reduce(
      (acc, item) => {
        switch (item.id) {
          case "listagem-sagas":
            acc[item.id] = getFromLocalStorage(StorageKeys.ORDER_SAGAS)
            break
          case "ocultar-sagas":
            acc[item.id] = getFromLocalStorage(StorageKeys.SHOW_COMPLETED_SAGAS)
            break
          case "escala-cinza":
            acc[item.id] = getFromLocalStorage(StorageKeys.HIDE_GRAYSCALE)
            break
          default:
            break
        }

        return acc
      },
      {} as Record<string, boolean>
    )
  )

  const handleSwitchChange = useCallback(
    (id: string, value: boolean) => {
      setSwitchStates((prev) => ({
        ...prev,
        [id]: value,
      }))

      switch (id) {
        case "listagem-sagas":
          handleToggleOrderList()
          break
        case "ocultar-sagas":
          handleHideCompletedSagas()
          break
        case "escala-cinza":
          handleHideGrayscale()
          break
        default:
          break
      }
    },
    [handleToggleOrderList, handleHideCompletedSagas, handleHideGrayscale]
  )

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h2 className="text-md font-semibold">Configurações de Exibição</h2>
        <p className="text-xs text-muted-foreground">
          Configure algumas opçãoes de exibição do site para personalizar sua
          experiência.
        </p>
      </header>

      <div>
        <FieldGroup className="w-full gap-2">
          {sectionData.map((item) => (
            <FieldLabel htmlFor={item.id} key={item.id}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{item.title}</FieldTitle>
                  <FieldDescription>{item.description}</FieldDescription>
                </FieldContent>
                <Switch
                  id={item.id}
                  checked={switchStates[item.id]}
                  onCheckedChange={(value) =>
                    handleSwitchChange(item.id, value)
                  }
                />
              </Field>
            </FieldLabel>
          ))}
        </FieldGroup>
      </div>
    </section>
  )
}

export default ShowComponent
