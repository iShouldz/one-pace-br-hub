import { QueryKeys } from "@/utils/enum/query-keys.util"
import { useQuery } from "@tanstack/react-query"
import type { ChangelogEntry } from "@/components/changelog1"

export type OpChangelogResponse = {
  logs: ChangelogEntry[]
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

const fetchChangeLogs = async (): Promise<OpChangelogResponse> => {
  const response = await fetch("https://api.npoint.io/ac3e33ff845bc152f016", {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new ApiError("Falha ao buscar o changelog", response.status)
  }

  return response.json() as Promise<OpChangelogResponse>
}

const useChangelogData = () => {
  const query = useQuery({
    queryKey: [QueryKeys.CHANGELOG_DATA],
    queryFn: fetchChangeLogs,
  })

  return {
    data: query.data,
    isError: query.isError,
    refetch: query.refetch,
    isLoading: query.isLoading,
    isPending: query.isPending,
  }
}

export default useChangelogData
