import { io, Socket } from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef } from "react"

import {
  NEW_MESSAGE,
  NEW_CHAT,
  USER_CONNECTED,
  JOIN_CHAT,
  TYPING,
  USER_ONLINE,
  USER_OFFLINE,
  USER_ONLINE_STATUS,
} from "@/lib/constants"
import { Chat } from "@/types/chat-interface"
import { Message } from "@/features/message-section/types/message-interface"
import { addMessage, setMessages } from "@/store/slices/messages"
import {
  addChat,
  setSelectedChat,
  setSelectedChatUser,
  updateChat,
  updateChatWithPersistentOrder,
} from "@/store/slices/chats"
import { RootState } from "@/store/store"
import useGetChat from "@/features/chat-section/hooks/getChat"

let socket: Socket | null = null // Singleton instance

const useSocketService = () => {
  const dispatch = useDispatch()

  const { getChat } = useGetChat()

  const { selectedChatUser } = useSelector((state: RootState) => state.chats)
  const { userId } = useSelector((state: RootState) => state.user)
  const { chats, selectedChat } = useSelector((state: RootState) => state.chats)

  const chatRef = useRef(chats)
  chatRef.current = chats

  const selectedChatRef = useRef(selectedChat)
  selectedChatRef.current = selectedChat

  useEffect(() => {
    if (!socket && userId.trim() !== "") {
      socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true,
      })

      socket?.emit(USER_CONNECTED, userId)

      setupListeners()
    }
  }, [userId])

  //* ---Listeners---
  const setupListeners = () => {
    if (!socket) return

    socket.on(NEW_CHAT, (data: { chat: Chat }) => {
      for (let i = 0; i < chatRef.current.length; i++) {
        if (chatRef.current[i]._id === data.chat._id) {
          return
        }
      }

      joinSocketChat(data.chat._id)
      dispatch(addChat(data.chat))
      dispatch(setMessages({ chatId: data.chat._id, messages: [] }))
    })

    socket.on(NEW_MESSAGE, async (data: { message: Message }, callback) => {
      const isChatExists = chatRef.current.findIndex(
        (chat) => chat._id === data.message.chatId
      )

      if (isChatExists === -1) {
        await getChat(data.message.chatId)
        joinSocketChat(data.message.chatId)
      }

      callback({
        status: true,
        message: "receiver received message",
      })

      dispatch(
        addMessage({ chatId: data.message.chatId, message: data.message })
      )

      let tempUnreadMessages = 1

      if (selectedChatRef.current?._id !== data.message.chatId) {
        for (let i = 0; i < chatRef.current.length; i++) {
          if (chatRef.current[i]._id === data.message.chatId) {
            tempUnreadMessages = chatRef.current[i].unreadMessages + 1
            break
          }
        }
      }

      dispatch(
        updateChat({
          chatId: data.message.chatId,
          updates: {
            lastMessage: {
              isPhoto: data.message.photoUrl !== "",
              message: data.message.message,
            },
            updatedAt: data.message.updatedAt,
            unreadMessages: tempUnreadMessages,
          },
        })
      )
    })

    socket.on(
      TYPING,
      (data: { chatId: string; userId: string; isTyping: boolean }) => {
        const typing = {
          typer: data.userId,
          isTyping: data.isTyping,
        }

        dispatch(
          updateChatWithPersistentOrder({
            chatId: data.chatId,
            updates: { typing },
          })
        )

        if (selectedChatRef.current?._id === data.chatId) {
          const tempChat = { ...selectedChatRef.current }
          tempChat.typing = typing

          dispatch(setSelectedChat(tempChat))
        }
      }
    )

    socket?.on("disconnect", () => {
      socket = null
      disconnectSocket()
    })
  }

  //* ---Emit Events---
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

  const sendSocketMessage = (message: Message, messageUsers: string[]) => {
    socket
      ?.timeout(10000)
      .emit(NEW_MESSAGE, { message, messageUsers }, (err: [], res: []) => {
        if (err || res?.length) {
          // TODO
        } else {
          // TODO
        }
      })
  }

  const sendSocketTyping = (isTyping: boolean) => {
    socket?.emit(TYPING, { chatId: selectedChat?._id, userId, isTyping })
  }

  const sendSocketOnline = () => {
    socket?.emit(USER_ONLINE, userId)
  }

  const sendSocketOffline = () => {
    socket?.emit(USER_OFFLINE, userId)
  }

  const findUserOnlineStatus = (userId: string) => {
    socket?.emit(
      USER_ONLINE_STATUS,
      userId,
      (online: boolean, updateAt: Date | null) => {
        if (selectedChatUser === null) return

        const tempUser = { ...selectedChatUser }
        tempUser.isUserOnline = online

        // Updating temperorily selected chat user data and we don't have to update the whole chats because
        // we are already getting this lastSeen by database and we already sending request to the backend and getting lastSeen
        if (!online && updateAt) {
          tempUser.updatedAt = updateAt
        }

        dispatch(setSelectedChatUser(tempUser))
      }
    )
  }

  return {
    connectSocket,
    disconnectSocket,
    newSocketChat,
    joinSocketChat,
    sendSocketMessage,
    sendSocketTyping,
    sendSocketOnline,
    sendSocketOffline,
    findUserOnlineStatus,
  }
}

export { useSocketService }
