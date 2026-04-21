import type { ISagaList } from "../../types"
import { onePieceSagas } from "../../utils/saga.utils"
import ArcBlockComponent from "../arc-block/arc-block.component"

const SagaList = ({
  handleRedirectToArcDetails,
  handleRedirectToSagaDetails,
}: ISagaList) => {
  return (
    <div className="flex flex-col gap-2">
      {onePieceSagas.map((saga) => (
        <>
          <ArcBlockComponent
            {...saga}
            key={saga.id}
            sagaId={saga.id}
            handleRedirectToArcDetails={handleRedirectToArcDetails}
            handleRedirectToSagaDetails={handleRedirectToSagaDetails}
          />
        </>
      ))}
    </div>
  )
}

export default SagaList
