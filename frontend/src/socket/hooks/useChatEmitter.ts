import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { JOIN_CHAT, TYPING } from "shared"
import { RootState } from "@/store/store"
import { getSocket } from "../socket.instance"

const useChatEmitter = () => {
  const { userId } = useSelector((state: RootState) => state.user)
  const [params] = useSearchParams()
  const activeChatId = params.get("chatId")

  const joinChat = useCallback((chatId: string) => {
    getSocket()?.emit(JOIN_CHAT, chatId)
  }, [])

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      getSocket()?.emit(TYPING, { chatId: activeChatId, userId, isTyping })
    },
    [activeChatId, userId]
  )

  return { joinChat, sendTyping }
}

export { useChatEmitter }
