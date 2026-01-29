import { useSearchParams } from "react-router-dom"
import { useEffect } from "react"

import { useSocketService } from "@/hooks/useSocketService"

const useUserOnlineStatus = () => {
  const [params] = useSearchParams()
  const activeChatUserId = params.get("userId")

  const { findUserOnlineStatus } = useSocketService()

  const handleGetUserOnlineStatus = () => {
    if (!activeChatUserId || document.visibilityState !== "visible") return
    findUserOnlineStatus(activeChatUserId)
  }

  useEffect(() => {
    // TODO: Add condition for check if the user has focus on the tab or not if yes then set setIntervel else if it is set then remove it
    if (!activeChatUserId || document.visibilityState !== "visible") return

    const intervalId = setInterval(handleGetUserOnlineStatus, 10000)

    return () => clearInterval(intervalId)
  }, [activeChatUserId])

  return
}

export default useUserOnlineStatus
