import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sendMessage } from "../services/messageService"
import { useSocketService } from "@/hooks/useSocketService"
import { useSearchParams } from "react-router-dom"
import { addMessageToQuery } from "../utils/message-queries"

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  const [params] = useSearchParams()

  const { sendSocketMessage } = useSocketService()

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["messages", data[0].chatId.toString()],
        (oldData: any) => addMessageToQuery({ oldData, message: data[0] })
      )

      // Send via socket to receiver
      // Sending message one by one using socket
      data.forEach((message: any) => {
        sendSocketMessage(message, [message.sender._id, params.get("userId")])
      })

      // Add to to lastMessage of the chat
      queryClient.setQueryData(["chats"], (oldData: any) => {
        if (!oldData) return oldData

        const message = data.at(-1) // message document
        const chatId = message.chatId

        let targetChat: any | null = null

        const allChats = oldData.pages.flatMap((page: any) =>
          page.chats.filter((chat: any) => {
            if (chat._id === chatId) {
              targetChat = {
                ...chat,
                lastMessage: message,
                unreadMessages: chat.unreadMessages + 1,
                updatedAt: message.updatedAt,
              }
              return false // remove from list
            }
            return true
          })
        )

        if (!targetChat) return oldData

        targetChat.unreadMessages = 0
        targetChat.updatedAt = message.updatedAt

        const reorderedChats = [targetChat, ...allChats]

        let cursor = 0
        const newPages = oldData.pages.map((page: any) => {
          const size = page.chats.length
          const chats = reorderedChats.slice(cursor, cursor + size)
          cursor += size

          return {
            ...page,
            chats,
          }
        })

        return {
          ...oldData,
          pages: newPages,
        }
      })
    },
  })
}
