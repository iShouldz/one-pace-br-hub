export const radialByDirection: Record<
  "top" | "bottom" | "left" | "right",
  string
> = {
  bottom:
    "radial-gradient(130% 75% at 50% 10%, rgba(5,9,24,0) 35%, rgba(5,9,24,0.35) 65%, rgba(5,9,24,0.78) 100%)",
  top: "radial-gradient(130% 75% at 50% 90%, rgba(5,9,24,0) 35%, rgba(5,9,24,0.35) 65%, rgba(5,9,24,0.78) 100%)",
  left: "radial-gradient(130% 75% at 90% 50%, rgba(5,9,24,0) 35%, rgba(5,9,24,0.35) 65%, rgba(5,9,24,0.78) 100%)",
  right:
    "radial-gradient(130% 75% at 10% 50%, rgba(5,9,24,0) 35%, rgba(5,9,24,0.35) 65%, rgba(5,9,24,0.78) 100%)",
}

export const linearByDirection: Record<
  "top" | "bottom" | "left" | "right",
  string
> = {
  bottom:
    "linear-gradient(to bottom, rgba(5,9,24,0.08) 0%, rgba(5,9,24,0.22) 36%, rgba(5,9,24,0.65) 70%, rgba(5,9,24,0.94) 88%, #050918 100%)",
  top: "linear-gradient(to top, rgba(5,9,24,0.08) 0%, rgba(5,9,24,0.22) 36%, rgba(5,9,24,0.65) 70%, rgba(5,9,24,0.94) 88%, #050918 100%)",
  left: "linear-gradient(to left, rgba(5,9,24,0.08) 0%, rgba(5,9,24,0.22) 36%, rgba(5,9,24,0.65) 70%, rgba(5,9,24,0.94) 88%, #050918 100%)",
  right:
    "linear-gradient(to right, rgba(5,9,24,0.08) 0%, rgba(5,9,24,0.22) 36%, rgba(5,9,24,0.65) 70%, rgba(5,9,24,0.94) 88%, #050918 100%)",
}
