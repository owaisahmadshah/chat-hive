import { useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import { usePresenceEmitter } from "@/socket/hooks/usePresenceEmitter"

const useUserOnlineStatus = () => {
  const [params] = useSearchParams()
  const activeChatUserId = params.get("userId")

  const { getOnlineStatus } = usePresenceEmitter()

  const handleGetUserOnlineStatus = () => {
    if (!activeChatUserId || document.visibilityState !== "visible") return
    getOnlineStatus(activeChatUserId)
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
