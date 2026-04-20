import type { IBackgroundHeader } from "./types"

const BackgroundHeaderComponent = ({
  direction,
  imageUrl,
}: IBackgroundHeader) => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[82svh] min-h-135 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />

      <div className="absolute inset-0 bg-black/35" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(130% 75% at 50% 10%, rgba(5,9,24,0) 35%, rgba(5,9,24,0.35) 65%, rgba(5,9,24,0.78) 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(5,9,24,0.08) 0%, rgba(5,9,24,0.22) 36%, rgba(5,9,24,0.65) 70%, rgba(5,9,24,0.94) 88%, #050918 100%)",
        }}
      />
    </div>
  )
}

export default BackgroundHeaderComponent
