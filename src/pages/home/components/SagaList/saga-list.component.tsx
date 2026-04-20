import { onePieceSagas } from "../../utils/saga.utils"
import ArcBlockComponent from "../arc-block/arc-block.component"

const SagaList = () => {
  return (
    <div>
      {onePieceSagas.map((saga) => (
        <ArcBlockComponent key={saga.id} {...saga} />
      ))}
    </div>
  )
}

export default SagaList
