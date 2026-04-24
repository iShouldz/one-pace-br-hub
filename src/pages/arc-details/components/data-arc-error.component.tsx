import { ServerOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ArcStatsError() {
  return (
    <Card className="flex h-full  w-full max-w-sm flex-col items-center justify-center border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xl sm:max-w-md">
      <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full border border-zinc-800/50 bg-zinc-900/50 p-4">
          <ServerOff className="h-8 w-8 text-zinc-500" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-zinc-300">
            Falha na Sincronização
          </h3>
          <p className="text-sm leading-relaxed text-zinc-500">
            Não foi possível obter os dados ao vivo da planilha oficial do One
            Pace no momento.
          </p>
        </div>

        <div className="mt-2 rounded border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-xs text-zinc-400">
          ERR_SHEETS_UNAVAILABLE
        </div>
      </CardContent>
    </Card>
  )
}
