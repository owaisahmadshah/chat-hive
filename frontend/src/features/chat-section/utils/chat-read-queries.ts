import { InfiniteData, useQueryClient } from "@tanstack/react-query"

import { ChatsPage } from "../../../types/chat"
import { TChat } from "shared"

export const useChatReadQueries = () => {
  const queryClient = useQueryClient()

  // Checks if the user has chat with chatId
  const hasChat = ({ chatId }: { chatId: string }): boolean => {
    const data = queryClient.getQueryData<InfiniteData<ChatsPage>>(["chats"])

    if (data) {
      const chats: TChat[] = data.pages.flatMap((page) => page.chats)

      return chats.some((chat: TChat) => chat._id === chatId)
    }

    return false
  }

  const hasChatByUserId = ({ userId }: { userId: string }) => {
    const data = queryClient.getQueryData<InfiniteData<ChatsPage>>(["chats"])

    if (data) {
      const chats: TChat[] = data.pages.flatMap((page) => page.chats)

      for (let i = 0; i < chats.length; i++) {
        if (chats[i].user._id === userId) {
          return { exists: true, chat: chats[i] }
        }
      }
    }

    return { exists: false, chat: null }
  }

  const getUnreadMessages = (chatId: string): number => {
    const data = queryClient.getQueryData<InfiniteData<ChatsPage>>(["chats"])

    if (!data) return 0

    const chats: TChat[] = data.pages.flatMap((page) => page.chats)

    for (let i = 0; i < chats.length; i++) {
      if (chats[i]._id === chatId) {
        return chats[i].unreadMessages
      }
    }

    return 0
  }

  return { hasChat, hasChatByUserId, getUnreadMessages }
}
