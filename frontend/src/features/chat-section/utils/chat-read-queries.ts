import { useQueryClient } from "@tanstack/react-query"

export const useChatReadQueries = () => {
  const queryClient = useQueryClient()

  // Checks if the user has chat with chatId
  const hasChat = ({ chatId }: { chatId: string }): boolean => {
    const data = queryClient.getQueryData(["chats"])

    if (data) {
      const chats = data.pages.flatMap((page: any) => page.chats)

      return chats.some((chat: any) => chat._id === chatId)
    }

    return false
  }

  const hasChatByUserId = ({ userId }: { userId: string }) => {
    const data = queryClient.getQueryData(["chats"])

    if (data) {
      const chats = data.pages.flatMap((page: any) => page.chats)

      for (let i = 0; i < chats.length; i++) {
        if (chats[i].user._id === userId) {
          return { exists: true, chat: chats[i] }
        }
      }
    }

    return { exists: false, chat: null }
  }

  return { hasChat, hasChatByUserId }
}
