import type { IBackgroundHeader } from "./types"
import {
  linearByDirection,
  radialByDirection,
} from "./utils/radial-linear-direction.utils"

const BackgroundHeaderComponent = ({
  direction = "bottom",
  imageUrl = "/wallpaper-background.png",
  children,
}: IBackgroundHeader) => {
  return (
    <div className="relative isolate h-screen w-full overflow-x-hidden bg-[#050918] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-svh min-h-135 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />

        <div className="absolute inset-0 bg-black/35" />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: radialByDirection[direction],
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: linearByDirection[direction],
          }}
        />
      </div>
      {children}
    </div>
  )
}

export default BackgroundHeaderComponent
