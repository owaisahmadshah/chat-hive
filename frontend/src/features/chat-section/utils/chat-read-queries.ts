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

  return { hasChat }
}
