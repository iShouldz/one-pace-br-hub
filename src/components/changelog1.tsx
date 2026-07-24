import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const UpdateTypeProps = {
  Feature: "feature",
  Improvement: "improvement",
  Bugfix: "bugfix",
  Security: "security",
  Other: "other",
} as const

export type UpdateTypeProps =
  (typeof UpdateTypeProps)[keyof typeof UpdateTypeProps]

export type ChangelogEntry = {
  badgeType?:
    | "link"
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | null
    | undefined
  updateType: UpdateTypeProps
  badgeTitle?: string
  date: string
  title: string
  description: string
  items?: string[]
  image?: string
  button?: {
    url: string
    text: string
  }
  author: string
}

export interface Changelog1Props {
  className?: string
  title?: string
  description?: string
  entries?: ChangelogEntry[]
}

const Changelog = ({
  entries,
  className,
  title = "Atualizações recentes",
  description = "Mudanças e atualizações recentes do One Pace BR Hub",
}: Changelog1Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mb-6 text-base text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl space-y-16 md:mt-24 md:space-y-24">
          {entries?.map((entry, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-4 md:flex-row md:gap-16"
            >
              <div className="top-8 flex h-min w-64 shrink-0 flex-col gap-4 md:sticky">
                <div className="flex gap-2">
                  <Badge
                    variant={entry.badgeType ?? "default"}
                    className="text-xs"
                  >
                    {entry.badgeTitle ?? entry.updateType}
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    {entry.date}
                  </span>
                </div>
                <span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Autor:{" "}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {entry.author}
                  </span>
                </span>
              </div>
              <div className="flex flex-col">
                <h2 className="mb-3 flex items-center gap-2 text-lg leading-tight font-bold text-foreground/90 md:text-2xl">
                  <img
                    src="/images/icons/chapeu-de-palha.webp"
                    alt=""
                    className="size-7 opacity-80"
                  />{" "}
                  {entry.title}
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  {entry.description}
                </p>
                {entry.items && entry.items.length > 0 && (
                  <ul className="mt-4 ml-4 space-y-1.5 text-sm text-muted-foreground md:text-base">
                    {entry.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {entry.image && (
                  <img
                    src={entry.image}
                    alt={`${entry.badgeTitle} visual`}
                    className="mt-8 w-full rounded-lg object-cover"
                  />
                )}
                {entry.button && (
                  <Button variant="link" className="mt-4 self-end" asChild>
                    <a href={entry.button.url} target="_blank">
                      {entry.button.text} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Changelog }
