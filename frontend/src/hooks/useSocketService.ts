import { io, Socket } from "socket.io-client"

import {
  NEW_MESSAGE,
  NEW_CHAT,
  USER_CONNECTED,
  JOIN_CHAT,
  TYPING,
} from "@/lib/constants"
import { Chat } from "@/types/chat-interface"
import { Message } from "@/features/message-section/types/message-interface"

let socket: Socket | null = null // Singleton instance

const useSocketService = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    })
  }

  const connectSocket = (userId: string) => {
    socket?.emit(USER_CONNECTED, userId)
  }

  const disconnectSocket = () => {
    socket?.disconnect()
    socket = null
  }

  const newSocketChat = (chat: Chat) => {
    socket?.emit(NEW_CHAT, { chat })
  }

  const joinSocketChat = (chatId: string) => {
    console.log("Joining chat", chatId)
    socket?.emit(JOIN_CHAT, chatId)
  }

  const sendSocketMessage = (chatId: string, message: Message) => {
    socket?.emit(NEW_MESSAGE, { chatId, message })
  }

  const onSocketTyping = (
    chatId: string,
    userId: string,
    isTyping: boolean
  ) => {
    socket?.emit(TYPING, { chatId, userId, isTyping })
  }

  return {
    connectSocket,
    disconnectSocket,
    newSocketChat,
    joinSocketChat,
    sendSocketMessage,
    onSocketTyping,
  }
}

export { useSocketService }
