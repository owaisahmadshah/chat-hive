import { io, Socket } from "socket.io-client"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

import {
  NEW_MESSAGE,
  NEW_CHAT,
  USER_CONNECTED,
  JOIN_CHAT,
  TYPING,
} from "@/lib/constants"
import { Chat } from "@/types/chat-interface"
import { Message } from "@/features/message-section/types/message-interface"
import { addMessage, setMessages } from "@/store/slices/messages"
import { addChat, updateChat } from "@/store/slices/chats"

let socket: Socket | null = null // Singleton instance

const useSocketService = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!socket) {
      socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true,
      })

      setupListeners()
    }

    return () => {
      socket?.off(NEW_MESSAGE)
      socket?.off(NEW_CHAT)
      socket?.off(TYPING)
    }
  }, [])

  const setupListeners = () => {
    if (!socket) return

    socket.on(NEW_CHAT, (data: { chat: Chat }) => {
      dispatch(addChat(data.chat))
      dispatch(setMessages({ chatId: data.chat._id, messages: [] }))
    })

    socket.on(NEW_MESSAGE, (data: { chatId: string; message: Message }) => {
      dispatch(addMessage({ chatId: data.chatId, message: data.message }))
      dispatch(
        updateChat({
          chatId: data.chatId,
          updates: {
            lastMessage: {
              message: data.message.message,
              photoUrl: data.message.photoUrl,
            },
            updatedAt: data.message.updatedAt,
          },
        })
      )
    })

    socket.on(
      TYPING,
      (data: { chatId: string; userId: string; isTyping: boolean }) => {
        // TODO: Implement typing event handling
      }
    )
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
