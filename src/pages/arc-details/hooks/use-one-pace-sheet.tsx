import { useState, useEffect } from "react"
import Papa from "papaparse"

const SHEET_ID = "1HQRMJgu_zArp-sLnvFMDzOyjdsht87eFLECxMK858lA"
const GID = "0"

const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`
export interface ArcPlanilhaStats {
  nome: string
  porcentagem: number
  epsOriginais: number
  epsPace: number
  minutosOriginais: number
  minutosPace: number
  minutosSalvos: number
  isTbr: boolean
}

export function useOnePaceSheet() {
  const [sheetRows, setSheetRows] = useState<any[][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const response = await fetch(url)
        const csvText = await response.text()

        Papa.parse(csvText, {
          complete: (result) => {
            setSheetRows(result.data as any[][])
            setLoading(false)
          },
          error: (err: any) => {
            console.error("Erro ao fazer parse do CSV:", err)
            setError("Erro ao processar os dados.")
            setLoading(false)
          },
        })
      } catch (err) {
        console.error("Erro no Fetch:", err)
        setError("Não foi possível carregar os dados ao vivo.")
        setLoading(false)
      }
    }

    fetchSheet()
  }, [])

  const parseNumber = (val: any): number => {
    if (!val) return 0
    const cleanStr = String(val).replace(/,/g, "").replace("%", "").trim()
    const num = Number(cleanStr)
    return isNaN(num) ? 0 : num
  }

  const getStatsForArc = (arcName: string): ArcPlanilhaStats | null => {
    if (sheetRows.length === 0) return null

    const row = sheetRows.find(
      (r) =>
        r[1] &&
        typeof r[1] === "string" &&
        r[1].toLowerCase().includes(arcName.toLowerCase())
    )
    if (!row) return null

    const rawName = String(row[1])

    return {
      nome: arcName,
      isTbr: rawName.includes("TBR"),
      epsPace: parseNumber(row[7]),
      epsOriginais: parseNumber(
        row[4].includes("-")
          ? Number(row[4].split("-")[1].trim()) -
              Number(row[4].split("-")[0].trim()) +
              1
          : 1
      ),
      minutosPace: parseNumber(row[9]),
      minutosOriginais: parseNumber(row[8]),
      minutosSalvos: parseNumber(row[10]),

      porcentagem:
        row[16] === "Pace"
          ? 100
          : ((row[16].split(" ")[6] - Number(row[4].split("-")[0].trim())) /
              (Number(row[4].split("-")[1].trim()) -
                Number(row[4].split("-")[0].trim()))) *
            100,
    }
  }

  return { loading, error, getStatsForArc }
}
