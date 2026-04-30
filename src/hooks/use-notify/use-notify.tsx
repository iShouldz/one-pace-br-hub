import { ApiError, type OpDataResponse } from "@/pages/home/hooks/use-op-data"
import { QueryKeys } from "@/utils/enum/query-keys.util"
import { useQuery } from "@tanstack/react-query"

export interface notificationData {
  title: string
  description: string
  type: string
  notifyCreatedAt: number
  notifyRunnedByDays: number
  buttonText?: string
  buttonUrl?: string
}

export type NotificationResponse = {
  notifications: notificationData[]
}
const useNotify = ({ data }: { data: OpDataResponse | undefined }) => {
  const fetchOpNotificationData = async (): Promise<NotificationResponse> => {
    const response = await fetch("https://api.npoint.io/07e239c98b2a606ae5b9", {
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      throw new ApiError("Falha ao buscar dados do One Pace", response.status)
    }

    return response.json() as Promise<NotificationResponse>
  }

  const query = useQuery({
    queryKey: [QueryKeys.OP_NOTIFICATION],
    queryFn: fetchOpNotificationData,
    enabled: data?.enabledNotify ?? false,
  })

  return {
    data: query.data,
    error: query.error,
    refetch: query.refetch,
    isLoading: query.isLoading,
  }
}

export default useNotify
