import { useQueryClient } from "@tanstack/react-query"

import { getUserChat } from "../services/chatService"
import { addChat } from "../utils/queries-updates"

export const useFetchChat = () => {
  const queryClient = useQueryClient()

  const fetchChat = async ({ chatId }: { chatId: string }) => {
    try {
      const chat = await getUserChat({ chatId })

      queryClient.setQueryData(["chats"], (oldData: any) =>
        addChat({ oldData, chat: chat })
      )
    } catch (error) {
      console.error(error)
    }
  }

  return {
    fetchChat,
  }
}
