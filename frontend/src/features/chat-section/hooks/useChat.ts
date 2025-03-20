import axios from "axios"
import { useAuth } from "@clerk/clerk-react"
import { useDispatch, useSelector } from "react-redux"

import { createChat, fetchUser } from "../services/chatService"
import { RootState } from "@/store/store"
import { setMessages } from "@/store/slices/messages"
import { ChatUser } from "@/types/chat-interface"
import {
  addChat,
  setSelectedChat,
  setSelectedChatUser,
} from "@/store/slices/chats"

const useChat = () => {
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const userId = useSelector((state: RootState) => state.user.userId)

  // This function will fetch users based on the search query of the user
  const fetchUsers = async (email: string) => {
    try {
      const token = await getToken()
      const data = await fetchUser({ email }, token)
      return data.data.users
    } catch (error) {
      console.error("Error fetching users", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
      return []
    }
  }

  const createNewChat = async (user: ChatUser) => {
    try {
      const token = await getToken()
      if (!userId) {
        return null
      }
      
      const usersSet = new Set([user._id, userId])
      const uniqueUsers = Array.from(usersSet)

      const chatBody = { admin: userId, users: uniqueUsers }
      const { data } = await createChat(chatBody, token)

      dispatch(addChat(data.data?.chat[0]))
      dispatch(setMessages({ chatId: data.data?.chat[0]?._id, messages: [] }))
      dispatch(setSelectedChatUser(user))
      dispatch(setSelectedChat(data.data?.chat[0]))
    } catch (error) {
      console.error("Error creating new chat", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }

  return { fetchUsers, createNewChat }
}

export { useChat }
