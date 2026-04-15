import { useCallback } from "react"
import {
  NEW_MESSAGE,
  SEEN_AND_RECEIVE_MESSAGE,
  SEEN_AND_RECEIVE_MESSAGES,
  Message,
} from "shared"
import { getSocket } from "../socket.instance"

const useMessageEmitter = () => {
  const sendMessage = useCallback(
    (message: Message, messageUsers: string[]) => {
      getSocket()?.timeout(10000).emit(NEW_MESSAGE, { message, messageUsers })
    },
    []
  )

  const updateSeenStatus = useCallback(
    (chatId: string, messageId: string, status: "seen" | "receive") => {
      getSocket()?.emit(SEEN_AND_RECEIVE_MESSAGE, { chatId, messageId, status })
    },
    []
  )

  const updateSeenStatuses = useCallback(
    (chatId: string, numberOfMessages: number, status: "seen" | "receive") => {
      getSocket()?.emit(SEEN_AND_RECEIVE_MESSAGES, {
        chatId,
        numberOfMessages,
        status,
      })
    },
    []
  )

  return { sendMessage, updateSeenStatus, updateSeenStatuses }
}

export { useMessageEmitter }
