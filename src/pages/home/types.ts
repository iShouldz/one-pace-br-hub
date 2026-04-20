export type IArc = {
  id: string
  title: string
  imagePath?: string
  description: string
}

export type ISaga = {
  id: string
  title: string
  arcs: IArc[]
}
