import { useSocketService } from "@/hooks/useSocketService"
import { RootState } from "@/store/store"
import { useEffect } from "react"
import { useSelector } from "react-redux"

const useUserOnlineStatus = () => {
  const { selectedChatUser } = useSelector((state: RootState) => state.chats)

  const { findUserOnlineStatus } = useSocketService()

  const handleGetUserOnlineStatus = () => {
    if (!selectedChatUser?._id || document.visibilityState !== "visible") return
    findUserOnlineStatus(selectedChatUser._id)
  }
  useEffect(() => {
    // TODO: Add condition for check if the user has focus on the tab or not if yes then set setIntervel else if it is set then remove it
    if (!selectedChatUser?._id || document.visibilityState !== "visible") return

    const intervalId = setInterval(handleGetUserOnlineStatus, 10000)

    return () => clearInterval(intervalId)
  }, [selectedChatUser?._id])

  return
}

export default useUserOnlineStatus
