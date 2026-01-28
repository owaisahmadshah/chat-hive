import { io, Socket } from "socket.io-client"
import { useSelector } from "react-redux"
import { useCallback, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import { RootState } from "@/store/store"

import {
  NEW_MESSAGE,
  USER_CONNECTED,
  JOIN_CHAT,
  TYPING,
  USER_ONLINE,
  USER_OFFLINE,
  USER_ONLINE_STATUS,
  SEEN_AND_RECEIVE_MESSAGE,
  SEEN_AND_RECEIVE_MESSAGES,
  Message,
  typingType,
  handleSeenAndReceiveMessageType,
  handleSeenAndReceiveMessagesType,
} from "shared"

import { useFetchChat } from "@/features/chat-section/hooks/useFetchChat"
import { useChatReadQueries } from "@/features/chat-section/utils/chat-read-queries"

import {
  updateChatTypingWithPersistantOrder,
  updateChatUnreadMessages,
  updateLastMessage,
} from "@/features/chat-section/utils/queries-updates"

import {
  addMessageToQuery,
  updateQueryMessagesStatus,
  updateQueryMessageStatus,
} from "@/features/message-section/utils/message-queries"

import { useUpdateMessageStatus } from "./useUpdateMessageStatus"
import { updateActiveChatUserTypingStatus } from "@/lib/user-queries-updates"

let socket: Socket | null = null // Singleton instance

const useSocketService = () => {
  const queryClient = useQueryClient()

  const { fetchChat } = useFetchChat()
  const { userId } = useSelector((state: RootState) => state.user)

  const { mutateAsync: updateMessageStatus } = useUpdateMessageStatus()

  const { hasChat } = useChatReadQueries()

  const [params] = useSearchParams()
  const activeChatId = params.get("chatId")
  const activeChatUserId = params.get("userId")

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
    if (!socket) {
      return
    }

    const handleNewMessage = async (
      data: { message: Message },
      callback: (response: { status: boolean; message: string }) => void
    ) => {
      if (!hasChat({ chatId: data.message.chatId })) {
        await fetchChat({ chatId: data.message.chatId })
        joinSocketChat(data.message.chatId)
      }

      callback({
        status: true,
        message: "receiver received message",
      })

      queryClient.setQueryData(
        ["messages", data.message.chatId],
        (oldData: any) => addMessageToQuery({ oldData, message: data.message })
      )

      if (
        activeChatId !== data.message.chatId ||
        document.visibilityState === "hidden"
      ) {
        // If the user is online but not using tab or on another chat he can definitely receive the message
        updateReceiveAndSeenOfMessage(
          data.message.chatId,
          data.message._id,
          "receive"
        )

        queryClient.setQueryData(["chats"], (oldData: any) =>
          updateChatUnreadMessages({
            oldData,
            chatId: data.message.chatId,
            value: 1,
            increment: true,
          })
        )
      } else {
        // If the user is another tab but selected the chat he can definitely receive the message but can't see
        if (document.visibilityState === "visible") {
          updateReceiveAndSeenOfMessage(
            data.message.chatId,
            data.message._id,
            "seen"
          )
        }
        await updateMessageStatus({
          messageId: data.message._id,
          status: "receive",
        })
      }

      if (data.message.chatId === activeChatId) {
        queryClient.setQueryData(["chats"], (oldData) =>
          updateChatUnreadMessages({ oldData, chatId: data.message._id })
        )
      }

      await updateMessageStatus({ messageId: data.message._id, status: "seen" })

      queryClient.setQueryData(["chats"], (oldData) =>
        updateLastMessage({
          oldData,
          chatId: data.message.chatId,
          lastMessage: data.message,
        })
      )
    }

    const handleTyping = (data: typingType) => {
      const typing = {
        typer: data.userId,
        isTyping: data.isTyping,
      }

      queryClient.setQueryData(["chats"], (oldData) =>
        updateChatTypingWithPersistantOrder({
          oldData,
          chatId: data.chatId,
          typing,
        })
      )

      if (activeChatUserId === data.userId && activeChatId === data.chatId) {
        queryClient.setQueryData(["user", data.userId], (oldData: any) =>
          updateActiveChatUserTypingStatus({
            oldData,
            isTyping: typing.isTyping,
          })
        )
      }
    }

    const handleSeenAndReceiveMessage = (
      data: handleSeenAndReceiveMessageType
    ) => {
      const { chatId, messageId, status } = data // receiver is not used here but maybe useful in the future

      //* Just update the message we have sent
      queryClient.setQueryData(["messages", chatId], (oldData) =>
        updateQueryMessageStatus({ oldData, messageId, status })
      )
    }

    const handleSeenAndReceiveMessages = (
      data: handleSeenAndReceiveMessagesType
    ) => {
      const { chatId, status } = data

      //* Just update the messages we have sent
      queryClient.setQueryData(["messages", chatId], (oldData) =>
        updateQueryMessagesStatus({
          oldData,
          status,
          currentUserId: userId,
        })
      )
    }

    const handleDisConnect = () => {
      socket = null
      disconnectSocket()
    }

    socket.on(NEW_MESSAGE, handleNewMessage)
    socket.on(TYPING, handleTyping)
    socket.on(SEEN_AND_RECEIVE_MESSAGE, handleSeenAndReceiveMessage) // only update on received or seen message, only update message we have sent
    socket.on(SEEN_AND_RECEIVE_MESSAGES, handleSeenAndReceiveMessages) // update on received or seen messages,update those messages we have sent
    socket.on("disconnect", handleDisConnect)
  }

  //* ---Emit Events---
  const connectSocket = useCallback((userId: string) => {
    socket?.emit(USER_CONNECTED, userId)
  }, [])

  const disconnectSocket = useCallback(() => {
    socket?.disconnect()
    socket = null
  }, [])

  const joinSocketChat = useCallback((chatId: string) => {
    socket?.emit(JOIN_CHAT, chatId)
  }, [])

  const sendSocketMessage = useCallback(
    (message: Message, messageUsers: string[]) => {
      socket
        ?.timeout(10000)
        .emit(NEW_MESSAGE, { message, messageUsers }, (err: [], res: []) => {
          if (err || res?.length) {
            // TODO
          } else {
            // TODO
          }
        })
    },
    []
  )

  const sendSocketTyping = useCallback(
    (isTyping: boolean) => {
      socket?.emit(TYPING, { chatId: activeChatId, userId, isTyping })
    },
    [activeChatId, userId]
  )

  const sendSocketOnline = useCallback(() => {
    socket?.emit(USER_ONLINE, userId)
  }, [userId])

  const sendSocketOffline = useCallback(() => {
    socket?.emit(USER_OFFLINE, userId)
  }, [userId])

  const findUserOnlineStatus = useCallback(
    (userId: string) => {
      socket?.emit(
        USER_ONLINE_STATUS,
        userId,
        (online: boolean, updateAt: Date | null) => {
          if (activeChatUserId === null) return

          queryClient.setQueryData(["user", userId], (oldData: any) => {
            if (!oldData) return oldData

            return {
              ...oldData,
              isUserOnline: online,
              updatedAt: updateAt ? updateAt : oldData.updatedAt,
            }
          })
        }
      )
    },
    [activeChatUserId, queryClient]
  )

  const updateReceiveAndSeenOfMessage = useCallback(
    (
      chatId: string, // It is not always from the selected chat
      messageId: string,
      status: "seen" | "receive"
    ) => {
      socket?.emit(SEEN_AND_RECEIVE_MESSAGE, {
        chatId,
        messageId,
        status,
      })
    },
    []
  )

  const updateReceiveAndSeenOfMessages = useCallback(
    (
      chatId: string, // It is not always from the selected chat
      numberOfMessages: number,
      status: "seen" | "receive"
    ) => {
      socket?.emit(SEEN_AND_RECEIVE_MESSAGES, {
        chatId,
        numberOfMessages, // This will help to update the last received or unread messages
        status,
      })
    },
    []
  )

  return {
    connectSocket,
    disconnectSocket,
    joinSocketChat,
    sendSocketMessage,
    sendSocketTyping,
    sendSocketOnline,
    sendSocketOffline,
    findUserOnlineStatus,
    updateReceiveAndSeenOfMessage,
    updateReceiveAndSeenOfMessages,
  }
}

export { useSocketService }
