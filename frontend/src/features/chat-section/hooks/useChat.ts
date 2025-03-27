import axios from "axios"
import { useAuth } from "@clerk/clerk-react"
import { useDispatch, useSelector } from "react-redux"

import {
  createChat,
  deleteChatService,
  fetchUser,
} from "../services/chatService"
import { RootState } from "@/store/store"
import { clearChatMessages, setMessages } from "@/store/slices/messages"
import { ChatUser } from "@/types/chat-interface"
import {
  addChat,
  setSelectedChat,
  setSelectedChatUser,
  deleteChat,
} from "@/store/slices/chats"
import { useSocketService } from "@/hooks/useSocketService"

const useChat = () => {
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const { newSocketChat } = useSocketService()
  const userId = useSelector((state: RootState) => state.user.userId)
  const selectedChat = useSelector(
    (state: RootState) => state.chats.selectedChat
  )

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

      const usersSet = new Set([user._id, userId])
      const uniqueUsers = Array.from(usersSet)

      const chatBody = { admin: userId, users: uniqueUsers }
      const { data } = await createChat(chatBody, token)

      //* Emitting new chat event to the server
      newSocketChat(data.data?.chat[0])
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

  const deleteAChat = async (chatId: string) => {
    try {
      const token = await getToken()

      const deleteChatBody = { userId, chatId }
      await deleteChatService(deleteChatBody, token)

      if (chatId === selectedChat?._id) {
        dispatch(setSelectedChat(null))
        dispatch(setSelectedChatUser(null))
      }
      dispatch(deleteChat(chatId))
      dispatch(clearChatMessages(chatId))
    } catch (error) {
      console.error("Error deleting chat", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }

  return { fetchUsers, createNewChat, deleteAChat }
}

export { useChat }
