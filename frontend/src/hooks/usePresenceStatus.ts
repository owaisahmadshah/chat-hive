import { useEffect, useState } from "react"
import { useSocketService } from "./useSocketService"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const usePresenceStatus = () => {
  const [lastStatus, setLastStatus] = useState<boolean | null>(null)
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false)

  const { sendSocketOnline, sendSocketOffline } = useSocketService()

  const user = useSelector((state: RootState) => state.user)

  const updateUserStatus = (status: boolean) => {
    if (lastStatus !== status && !user.isLoading) {
      setLastStatus(status)
      if (status) {
        sendSocketOnline()
      } else {
        sendSocketOffline()
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
      updateUserStatus(document.visibilityState === "visible" ? true : false)
    }

    const handleFocus = () => updateUserStatus(true)
    const handleBlur = () => updateUserStatus(false)

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("blur", handleBlur)
    }
  }, [lastStatus, user])

  return
}

export default usePresenceStatus
