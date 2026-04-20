export type IArc = {
  id: string
  title: string
  imagePath?: string
  description: string
}

export type ISaga = {
  id: string
  title: string
  description: string
  arcs: IArc[]
}
