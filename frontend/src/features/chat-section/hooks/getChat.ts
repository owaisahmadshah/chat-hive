import { useDispatch } from "react-redux"
import axios from "axios"

import { getUserChat } from "../services/chatService"
import { addChat } from "@/store/slices/chats"
import { setMessages } from "@/store/slices/messages"

const useGetChat = () => {
  const dispatch = useDispatch()

  const getChat = async (chatId: string) => {
    try {
      const { data } = await getUserChat({ chatId })

      dispatch(addChat(data.data?.chat[0]))
      dispatch(setMessages({ chatId: data.data?.chat[0]._id, messages: [] }))
    } catch (error) {
      console.error("Error sending message", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }
  return { getChat }
}

export default useGetChat
