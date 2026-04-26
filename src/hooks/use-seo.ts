import { useEffect } from "react"
import { setSeo } from "@/lib/seo"

type UseSeoPayload = Parameters<typeof setSeo>[0]

const useSeo = (payload: UseSeoPayload) => {
  useEffect(() => {
    setSeo(payload)
  }, [payload])
}

export default useSeo
