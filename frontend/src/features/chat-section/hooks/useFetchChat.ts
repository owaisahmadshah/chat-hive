import { getUserChat } from "../services/chatService"
import { addChat } from "../utils/queries-updates"

export const useFetchChat = () => {
  const fetchChat = async ({ chatId }: { chatId: string }) => {
    try {
      const chat = await getUserChat({ chatId })
      addChat(chat)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    fetchChat,
  }
}
