import { StorageKeys } from "@/utils/enum/storage-keys.utils"
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/storage.utils"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useMemo, useState } from "react"
import useOpData from "./use-op-data"
import type { ResolvedTheme } from "@/components/theme-provider"

const useDialogControl = () => {
  const { theme, setTheme } = useTheme()
  const { data, isLoading } = useOpData()
  const [orderSagas, setOrderSagas] = useState<boolean>(
    getFromLocalStorage(StorageKeys.ORDER_SAGAS) ?? false
  )

  const [openSettings, setOpenSettings] = useState(false)

  const [showAllSagas, setShowAllSagas] = useState<boolean>(
    getFromLocalStorage(StorageKeys.SHOW_COMPLETED_SAGAS) ?? true
  )

  const [hideGrayscale, setHideGrayscale] = useState<boolean>(
    getFromLocalStorage(StorageKeys.HIDE_GRAYSCALE) ?? false
  )

  const handleHideCompletedSagas = useCallback(() => {
    setShowAllSagas((prevState) => {
      saveToLocalStorage(StorageKeys.SHOW_COMPLETED_SAGAS, !prevState)
      return !prevState
    })
  }, [])

  const opSaga = useMemo(() => {
    if (!data || !orderSagas) {
      return data
    }

    return {
      ...data,
      sagas: [...(data.sagas ?? [])].reverse(),
    }
  }, [data, orderSagas])

  const currentTheme: ResolvedTheme = theme === "light" ? "light" : "dark"

  const [currentOnePieceSagas, setCurrentOnePieceSagas] = useState(opSaga)

  const handleToggleOrderList = useCallback(() => {
    setCurrentOnePieceSagas((prevState) => {
      if (!prevState || !prevState.sagas) {
        return prevState
      }

      return {
        ...prevState,
        sagas: [...prevState.sagas].reverse(),
      }
    })

    setOrderSagas((prevState) => {
      saveToLocalStorage(StorageKeys.ORDER_SAGAS, !prevState)
      return !prevState
    })
  }, [])

  const handleHideGrayscale = useCallback(() => {
    setHideGrayscale((prevState) => {
      saveToLocalStorage(StorageKeys.HIDE_GRAYSCALE, !prevState)
      return !prevState
    })
  }, [])

  const handleToggleSettings = useCallback(() => {
    setOpenSettings((prev) => !prev)
  }, [])

  const handleToggleTheme = useCallback(() => {
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }, [currentTheme, setTheme])

  useEffect(() => {
    setCurrentOnePieceSagas(opSaga)
  }, [opSaga])

  return {
    isLoading,
    orderSagas,
    openSettings,
    showAllSagas,
    currentTheme,
    hideGrayscale,
    handleToggleTheme,
    handleHideGrayscale,
    handleToggleSettings,
    currentOnePieceSagas,
    handleToggleOrderList,
    handleHideCompletedSagas,
  }
}

export default useDialogControl
