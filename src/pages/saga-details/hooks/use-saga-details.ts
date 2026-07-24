import { QueryKeys } from "@/utils/enum/query-keys.util"
import { useQuery } from "@tanstack/react-query"
import type { ISaga } from "../../home/types"

export type SagaDetailsResponse = ISaga

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

const fetchSagaDetails = async (
  sagaId: string
): Promise<SagaDetailsResponse> => {
  if (!sagaId?.trim()) {
    throw new ApiError("ID da saga invalido", 400)
  }

  const response = await fetch(
    `https://api.npoint.io/cbc6cf2bcd44b0272298/saga/${sagaId}`,
    {
      headers: { Accept: "application/json" },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError("Saga nao encontrada", response.status)
    }
    throw new ApiError("Falha ao buscar detalhes da saga", response.status)
  }

  return response.json() as Promise<SagaDetailsResponse>
}

export const useSagaDetails = (sagaId?: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.OP_DATA, "saga", sagaId],
    queryFn: () => fetchSagaDetails(sagaId!),
    enabled: Boolean(sagaId),
    staleTime: 10 * 60 * 1000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export default useSagaDetails
