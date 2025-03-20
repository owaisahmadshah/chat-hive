import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { z } from "zod"

import { messageSchema } from "../types/message-schema"
import { addMessage } from "@/store/slices/messages"
import { RootState } from "@/store/store"
import { sendMessage } from "../services/messageService"
import { useAuth } from "@clerk/clerk-react"
import { updateChat } from "@/store/slices/chats"

const useMessage = () => {
  const dispatch = useDispatch()
  const { getToken } = useAuth()

  const userId = useSelector((state: RootState) => state.user.userId)
  const { selectedChat } = useSelector((state: RootState) => state.chats)

  const sendNewMessage = async (values: z.infer<typeof messageSchema>) => {
    try {
      const messageData = {
        sender: userId,
        chatId: selectedChat?._id,
        message: values.userInputMessage,
        status: "sent",
      }

      const token = await getToken()
      const data = await sendMessage(messageData, token)

      dispatch(
        addMessage({
          chatId: selectedChat?._id || "",
          message: data.data.filteredMessage,
        })
      )
      dispatch(
        updateChat({
          chatId: selectedChat?._id || "",
          updates: {
            lastMessage: {
              message: data.data.filteredMessage.message,
              photoUrl: data.data.filteredMessage.photoUrl,
            },
            updatedAt: data.data.filteredMessage.updatedAt,
          },
        })
      )
    } catch (error) {
      console.error("Error sending message", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }
  return { sendNewMessage }
}

export { useMessage }
