"use client"

import {
  AlertTriangle,
  ArrowUpRight,
  PieChart,
  TrendingDown,
} from "lucide-react"
import { Label, PolarGrid, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import type { ArcPlanilhaStats } from "../hooks/use-one-pace-sheet"

const chartConfig = {
  progresso: {
    label: "Conclusão do Arco",
    color: "hsl(var(--blue-500))",
  },
}

export function ArcStatsCard({ stats }: { stats: ArcPlanilhaStats }) {
  const epsEconomizados = stats.epsOriginais - stats.epsPace

  const chartData = [
    {
      category: "progresso",
      fill: "var(--color-progresso)",
      value: stats.porcentagem,
    },
  ]

  return (
    <Card className="flex w-full max-w-sm flex-col border bg-transparent text-accent-foreground shadow-xl sm:max-w-md">
      <CardHeader className="mb-4 items-center border-b pb-2">
        <CardTitle className="flex gap-2 text-xl font-bold text-white">
          {stats.nome}
        </CardTitle>
        {stats.isTbr && (
          <Badge
            variant="destructive"
            className="mb-2 flex animate-pulse gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Este arco será refeito em breve (TBR)
          </Badge>
        )}
        <CardDescription className="item-center flex text-sm text-accent-foreground">
          <a
            href="https://docs.google.com/spreadsheets/d/1HQRMJgu_zArp-sLnvFMDzOyjdsht87eFLECxMK858lA/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white hover:text-blue-300"
          >
            Status de Conclusão (segundo a planilha oficial)
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </CardDescription>
      </CardHeader>

      <CardContent className="relative flex-1 pb-0">
        {stats.porcentagem ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-50"
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={90 - 3.6 * stats.porcentagem}
              innerRadius={65}
              outerRadius={95}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-zinc-800 last:fill-zinc-950"
                polarRadius={[69, 57]}
              />
              <RadialBar dataKey="value" background cornerRadius={10} />
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-4xl font-extrabold"
                        >
                          {chartData[0].value.toFixed(1).toLocaleString()}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-zinc-400 text-sm"
                        >
                          Concluído
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </RadialBarChart>
          </ChartContainer>
        ) : (
          <div className="full mx-auto flex aspect-square max-h-50 flex-col items-center justify-center text-accent-foreground">
            <div className="mb-3 justify-center rounded-full border border-zinc-800/50 bg-zinc-900/50 p-4">
              <PieChart className="h-8 w-8 text-zinc-600" />
            </div>
            <span className="text-sm font-medium text-accent-foreground">
              Dados do gráfico indisponíveis
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-4 flex-col gap-4 border-t pt-5 text-sm">
        {stats.porcentagem !== 100 ? (
          <div className="flex items-center gap-2 font-medium text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            Este arco ainda não está completo, então os dados podem mudar!
          </div>
        ) : (
          <div className="flex items-center gap-2 font-medium text-emerald-400">
            <TrendingDown className="h-5 w-5" />
            {epsEconomizados} episódios economizados!
          </div>
        )}

        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 rounded-md border bg-zinc-900/50 p-3 text-zinc-300">
          <div className="flex items-center justify-between">
            <span>Episódios Originais:</span>
            <strong className="text-base text-white">
              {stats.epsOriginais}
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Runtime Total Original:</span>
            <strong className="flex text-base text-white">
              {(stats.minutosOriginais / 60).toFixed(1)}h
            </strong>{" "}
          </div>
          <div className="flex items-center justify-between">
            <span>Episódios Pace:</span>
            <strong className="text-base text-white">{stats.epsPace}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Runtime Total Pace:</span>
            <strong className="text-base text-white">
              {(stats.minutosPace / 60).toFixed(1)}h
            </strong>{" "}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
