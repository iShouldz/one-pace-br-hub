import { QueryKeys } from "@/utils/enum/query-keys.util"
import { useQuery } from "@tanstack/react-query"
import type { IArc } from "../../home/types"

export type ArcDetailsResponse = IArc

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

const fetchArcDetails = async (
  sagaId: string,
  arcId: string
): Promise<ArcDetailsResponse> => {
  if (!sagaId?.trim() || !arcId?.trim()) {
    throw new ApiError("IDs de saga ou arco invalidos", 400)
  }

  const response = await fetch(
    `https://api.npoint.io/cbc6cf2bcd44b0272298/saga/${sagaId}/arco/${arcId}`,
    {
      headers: { Accept: "application/json" },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError("Arco nao encontrado", response.status)
    }
    throw new ApiError("Falha ao buscar detalhes do arco", response.status)
  }

  return response.json() as Promise<ArcDetailsResponse>
}

export const useArcDetails = (sagaId?: string, arcId?: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.OP_DATA, "saga", sagaId, "arco", arcId],
    queryFn: () => fetchArcDetails(sagaId!, arcId!),
    enabled: Boolean(sagaId && arcId),
    staleTime: 10 * 60 * 1000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export default useArcDetails
