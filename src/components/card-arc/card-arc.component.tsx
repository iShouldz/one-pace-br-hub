import { Card } from "../ui/card"
import type { ICardArc } from "../carousel-arc/types"
import { useMemo } from "react"
import { getFromLocalStorage } from "@/utils/storage.utils"
import { StorageKeys } from "@/utils/storage-keys.utils"
import { Check } from "lucide-react"
import type { IOnePaceArc } from "@/pages/arc-details/types"
const CardArcComponent = ({
  arc,
  sagaId,
  handleRedirectToArcDetails,
}: ICardArc) => {
  const hasDoneArc = useMemo(() => {
    const completedArcs: IOnePaceArc[] =
      getFromLocalStorage(StorageKeys.COMPLETED_ONE_PACE) || []

    if (completedArcs.map((item) => item.id).indexOf(sagaId) === -1) {
      return false
    }

    return completedArcs.some((id) =>
      id.arcos.some((arcId) => String(arcId) === String(arc.id))
    )
  }, [arc.id, sagaId])

  const hideGrayscale = getFromLocalStorage(StorageKeys.HIDE_GRAYSCALE) || false

  return (
    <Card
      onClick={() => handleRedirectToArcDetails(sagaId, arc.id)}
      className="group relative mb-4 overflow-hidden rounded-2xl border-white/12 bg-white/5 p-0 shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-black/50"
    >
      <div className="relative">
        {hasDoneArc && (
          <div className="pointer-events-none absolute top-2 right-2 z-20 rounded-full bg-emerald-500 p-1.5 shadow-lg ring-2 ring-black/35">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}

        <img
          src={arc.imagePath ?? "/images/banners/poster.webp"}
          alt={arc.title}
          loading="lazy"
          className={`aspect-2/3 w-full object-cover transition duration-500 group-hover:scale-105 ${!hasDoneArc && !hideGrayscale ? "grayscale" : ""}`}
        />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#050918] via-[#050918]/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="text-base leading-tight font-semibold text-white">
            {arc.title}
          </h3>
          <p className="mt-1 line-clamp-3 text-xs text-white/75">
            {arc.description}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default CardArcComponent
