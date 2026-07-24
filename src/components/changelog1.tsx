import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"

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
      <div>
        <div className="mx-auto sm:flex sm:max-w-full sm:flex-col sm:items-center sm:text-center lg:max-w-4xl">
          <h1 className="mb-4 font-bold sm:text-5xl md:text-7xl lg:text-4xl">
            {title}
          </h1>
          <p className="mb-6 text-base text-muted-foreground md:text-3xl">
            {description}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl space-y-16 md:mt-24 md:space-y-24">
          {entries?.map((entry, index) => (
            <div key={index} className="flex flex-col gap-6">
              <div className="relative flex gap-4 md:flex-col-reverse md:gap-16 lg:flex-row">
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
                  <h2 className="mb-3 flex items-center gap-2 leading-tight font-bold text-foreground/90 md:text-4xl lg:text-lg">
                    <img
                      src="/images/icons/chapeu-de-palha.webp"
                      alt=""
                      className="opacity-80 md:size-12 lg:size-7"
                    />
                    {entry.title}
                  </h2>
                  <p className="text-muted-foreground md:text-xl lg:text-sm">
                    {entry.description}
                  </p>
                  {entry.items && entry.items.length > 0 && (
                    <ul className="mt-4 ml-4 space-y-1.5 text-sm text-muted-foreground md:text-base">
                      {entry.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="list-disc md:text-2xl lg:text-base"
                        >
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
              <Separator />{" "}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Changelog }
