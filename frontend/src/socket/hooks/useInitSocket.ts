import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"

import {
  NEW_MESSAGE,
  USER_CONNECTED,
  JOIN_CHAT,
  TYPING,
  SEEN_AND_RECEIVE_MESSAGE,
  SEEN_AND_RECEIVE_MESSAGES,
  Message,
  typingType,
  handleSeenAndReceiveMessageType,
  handleSeenAndReceiveMessagesType,
} from "shared"

import { RootState } from "@/store/store"
import { createSocket } from "../socket.instance"
import { useFetchChat } from "@/features/chat-section/hooks/useFetchChat"
import { useChatReadQueries } from "@/features/chat-section/utils/chat-read-queries"
import { useUpdateMessageStatus } from "@/hooks/useUpdateMessageStatus"

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

import { updateActiveChatUserTypingStatus } from "@/lib/user-queries-updates"

const useInitSocket = () => {
  const queryClient = useQueryClient()
  const { userId } = useSelector((state: RootState) => state.user)
  const { fetchChat } = useFetchChat()
  const { hasChat } = useChatReadQueries()
  const { mutateAsync: updateMessageStatus } = useUpdateMessageStatus()
  const [params] = useSearchParams()
  const activeChatId = params.get("chatId")
  const activeChatUserId = params.get("userId")

  useEffect(() => {
    if (!userId || userId.trim() === "") return

    const socket = createSocket()
    socket.emit(USER_CONNECTED, userId)

    // ── NEW_MESSAGE ────────────────────────────────────────────────────────
    const handleNewMessage = async (
      data: { message: Message },
      callback: (response: { success: boolean; message: string }) => void
    ) => {
      const { message } = data

      callback({ success: true, message: "RECEIVED_MESSAGE" })

      if (!hasChat({ chatId: message.chatId })) {
        await fetchChat({ chatId: message.chatId })
        socket.emit(JOIN_CHAT, message.chatId)
      }

      queryClient.setQueryData(["messages", message.chatId], (oldData: any) =>
        addMessageToQuery({ oldData, message })
      )

      queryClient.setQueryData(["chats"], (oldData: any) =>
        updateLastMessage({
          oldData,
          chatId: message.chatId,
          lastMessage: message,
        })
      )

      const isActiveChat =
        activeChatId === message.chatId &&
        document.visibilityState === "visible"

      const status: "seen" | "receive" = isActiveChat ? "seen" : "receive"

      socket.emit(SEEN_AND_RECEIVE_MESSAGE, {
        chatId: message.chatId,
        messageId: message._id,
        status,
      })

      await updateMessageStatus({ messageId: message._id, status })

      if (!isActiveChat) {
        queryClient.setQueryData(["chats"], (oldData: any) =>
          updateChatUnreadMessages({
            oldData,
            chatId: message.chatId,
            value: 1,
            increment: true,
          })
        )
      } else {
        queryClient.setQueryData(["chats"], (oldData: any) =>
          updateChatUnreadMessages({ oldData, chatId: message.chatId })
        )
      }
    }

    // ── TYPING ─────────────────────────────────────────────────────────────
    const handleTyping = (data: typingType) => {
      const typing = { typer: data.userId, isTyping: data.isTyping }

      queryClient.setQueryData(["chats"], (oldData: any) =>
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

    // ── SEEN_AND_RECEIVE_MESSAGE ───────────────────────────────────────────
    const handleSeenAndReceiveMessage = (
      data: handleSeenAndReceiveMessageType
    ) => {
      const { chatId, messageId, status } = data
      queryClient.setQueryData(["messages", chatId], (oldData: any) =>
        updateQueryMessageStatus({ oldData, messageId, status })
      )
    }

    // ── SEEN_AND_RECEIVE_MESSAGES ──────────────────────────────────────────
    const handleSeenAndReceiveMessages = (
      data: handleSeenAndReceiveMessagesType
    ) => {
      const { chatId, status } = data
      queryClient.setQueryData(["messages", chatId], (oldData: any) =>
        updateQueryMessagesStatus({ oldData, status, currentUserId: userId })
      )
    }

    // ── RECONNECT ──────────────────────────────────────────────────────────
    const handleReconnect = async () => {
      socket.emit(USER_CONNECTED, userId)
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      if (activeChatId) {
        // It will invalidate only active chat
        // queryClient.invalidateQueries({ queryKey: ["messages", activeChatId] })
      }
      // It will invalidate all
      queryClient.invalidateQueries({ queryKey: ["messages"] })
    }

    socket.on("reconnect", handleReconnect)
    socket.on(NEW_MESSAGE, handleNewMessage)
    socket.on(TYPING, handleTyping)
    socket.on(SEEN_AND_RECEIVE_MESSAGE, handleSeenAndReceiveMessage)
    socket.on(SEEN_AND_RECEIVE_MESSAGES, handleSeenAndReceiveMessages)

    return () => {
      socket.off(NEW_MESSAGE, handleNewMessage)
      socket.off(TYPING, handleTyping)
      socket.off(SEEN_AND_RECEIVE_MESSAGE, handleSeenAndReceiveMessage)
      socket.off(SEEN_AND_RECEIVE_MESSAGES, handleSeenAndReceiveMessages)
    }
  }, [userId])
}

export { useInitSocket }
