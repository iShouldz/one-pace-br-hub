import { QueryKeys } from "@/utils/enum/query-keys.util"
import { useQuery } from "@tanstack/react-query"
import type { ISaga } from "../types"

export type OpDataResponse = {
  sagas?: ISaga[]
  enabledNotify: boolean
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

const fetchOpData = async (): Promise<OpDataResponse> => {
  const response = await fetch("https://api.npoint.io/cbc6cf2bcd44b0272298", {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new ApiError("Falha ao buscar dados do One Pace", response.status)
  }

  return response.json() as Promise<OpDataResponse>
}

const useOpData = () => {
  const query = useQuery({
    queryKey: [QueryKeys.OP_DATA],
    queryFn: fetchOpData,
  })

  return {
    data: query.data,
    error: query.error,
    refetch: query.refetch,
    isLoading: query.isLoading,
  }
}

export default useOpData
