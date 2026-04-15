import { useCallback } from "react"
import { useSelector } from "react-redux"
import { useQueryClient } from "@tanstack/react-query"
import { USER_ONLINE, USER_OFFLINE, USER_ONLINE_STATUS } from "shared"
import { RootState } from "@/store/store"
import { getSocket } from "../socket.instance"

const usePresenceEmitter = () => {
  const { userId } = useSelector((state: RootState) => state.user)
  const queryClient = useQueryClient()

  const sendOnline = useCallback(() => {
    getSocket()?.emit(USER_ONLINE, userId)
  }, [userId])

  const sendOffline = useCallback(() => {
    getSocket()?.emit(USER_OFFLINE, userId)
  }, [userId])

  const getOnlineStatus = useCallback((targetUserId: string) => {
    getSocket()?.emit(
      USER_ONLINE_STATUS,
      targetUserId,
      (online: boolean, updatedAt: Date | null) => {
        if (!targetUserId) return
        queryClient.setQueryData(["user", targetUserId], (oldData: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            isUserOnline: online,
            updatedAt: updatedAt ?? oldData.updatedAt,
          }
        })
      }
    )
  }, [])

  return { sendOnline, sendOffline, getOnlineStatus }
}

export { usePresenceEmitter }
