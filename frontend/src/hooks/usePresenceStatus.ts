import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { usePresenceEmitter } from "@/socket/hooks/usePresenceEmitter"
import { useSearchParams } from "react-router-dom"
import { useUpdateChatSeenMessages } from "./useUpdateChatSeenMessages"

const usePresenceStatus = () => {
  const [lastStatus, setLastStatus] = useState<boolean | null>(null)
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false)

  const { sendOnline, sendOffline } = usePresenceEmitter()
  const [params] = useSearchParams()
  const activeChatId = params.get("chatId")

  const { mutate: updateMessagesStatus } = useUpdateChatSeenMessages()

  const user = useSelector((state: RootState) => state.user)

  const updateUserStatus = (status: boolean) => {
    if (lastStatus !== status && !user.isLoading) {
      setLastStatus(status)
      if (status) {
        sendOnline()
      } else {
        sendOffline()
      }
    }
  }

  // This will ensure that if user is properly loaded and user is currently using the tab then we'll update
  useEffect(() => {
    if (
      !isUserLoaded &&
      !user.isLoading &&
      document.visibilityState === "visible"
    ) {
      setIsUserLoaded(true)
      updateUserStatus(true)
    }
  }, [user])

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible"

      updateUserStatus(isVisible)

      // This covers mobile app switching, tab switching on mobile
      if (isVisible && activeChatId) {
        updateMessagesStatus({ chatId: activeChatId, status: "seen" })
      }
    }

    const handleFocus = () => {
      updateUserStatus(true)

      if (activeChatId) {
        updateMessagesStatus({ chatId: activeChatId, status: "seen" })
      }
    }
    const handleBlur = () => updateUserStatus(false)

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", handleBlur)
    }
  }, [lastStatus, user, activeChatId])

  return
}

export default usePresenceStatus
