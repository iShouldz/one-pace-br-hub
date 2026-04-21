import { getFromLocalStorage } from "@/utils/storage.utils"
import type { ISagaList } from "../../types"
import ArcBlockComponent from "../arc-block/arc-block.component"
import { StorageKeys } from "@/utils/storage-keys.utils"
import type { IOnePaceArc } from "@/pages/arc-details/types"

const SagaList = ({
  showAllSagas,
  onePieceSagas,
  handleRedirectToArcDetails,
  handleRedirectToSagaDetails,
}: ISagaList) => {
  return (
    <div className="flex flex-col gap-2">
      {onePieceSagas.map((saga) => {
        const completedOnePace: IOnePaceArc[] =
          getFromLocalStorage(StorageKeys.COMPLETED_ONE_PACE) || []
        if (
          completedOnePace?.find((item) => item.id === saga.id)?.arcos
            .length === saga.arcs.length &&
          !showAllSagas
        ) {
          return null
        }
        return (
          <ArcBlockComponent
            {...saga}
            key={saga.id}
            sagaId={saga.id}
            handleRedirectToArcDetails={handleRedirectToArcDetails}
            handleRedirectToSagaDetails={handleRedirectToSagaDetails}
          />
        )
      })}
    </div>
  )
}

export default SagaList
