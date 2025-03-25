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

class SocketService {
  private socket: Socket | null = null

  connect(userId: string) {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true,
      })
    }
    this.socket.on("connect", () => {
      this.socket?.emit(USER_CONNECTED, userId)
    })
    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }

  newChat(chat: Chat) {
    this.socket?.emit(NEW_CHAT, { chat })
  }

  joinChat(chatId: string) {
    this.socket?.emit(JOIN_CHAT, chatId)
  }

  sendMessage(chatId: string, message: Message) {
    this.socket?.emit(NEW_MESSAGE, { chatId, message })
  }

  onTyping(chatId: string, userId: string, isTyping: boolean) {
    this.socket?.emit(TYPING, { chatId, userId, isTyping })
  }
}

export const socketService = new SocketService()
