import React from "react"
import { useNavigate } from "react-router"

const useNavigation = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return { handleBack }
}

export default useNavigation
