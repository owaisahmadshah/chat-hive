import { useAuth } from "@clerk/clerk-react"
import { getUserChat } from "../services/chatService"
import { useDispatch } from "react-redux"
import { addChat } from "@/store/slices/chats"
import { setMessages } from "@/store/slices/messages"
import axios from "axios"

const useGetChat = () => {
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const getChat = async (chatId: string) => {
    try {
      const token = await getToken()
      const { data } = await getUserChat({ chatId }, token)

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
