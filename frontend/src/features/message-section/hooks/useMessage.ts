import { useDispatch, useSelector } from "react-redux"
import axios from "axios"

import { addMessage, deleteMessage } from "@/store/slices/messages"
import { RootState } from "@/store/store"
import { deleteMessageService, sendMessage } from "../services/messageService"
import { useAuth } from "@clerk/clerk-react"
import { updateChat } from "@/store/slices/chats"
import { useSocketService } from "@/hooks/useSocketService"

const useMessage = () => {
  const dispatch = useDispatch()
  const { getToken } = useAuth()

  const userId = useSelector((state: RootState) => state.user.userId)
  const { selectedChat } = useSelector((state: RootState) => state.chats)
  const { sendSocketMessage } = useSocketService()

  const sendNewMessage = async (formData: FormData) => {
    try {
      if (!selectedChat) {
        return
      }

      formData.append("sender", userId)
      formData.append("chatId", selectedChat._id)
      formData.append("status", "sent")

      const token = await getToken()
      const data = await sendMessage(formData, token)

      const newMessage = {
        chatId: selectedChat?._id,
        message: data.data.filteredMessage,
      }

      dispatch(addMessage(newMessage))
      dispatch(
        updateChat({
          chatId: selectedChat?._id,
          updates: {
            updatedAt: data.data.filteredMessage.updatedAt,
          },
        })
      )

      // TODO add these users to redux-toolkit so we don't need to get them every time
      const messageUsers = selectedChat?.users?.map((u) => u._id)

      sendSocketMessage(data.data.filteredMessage, messageUsers)
    } catch (error) {
      console.error("Error sending message", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }

  const deleteSelectedMessage = async (messageId: string) => {
    try {
      const selectedChatId = selectedChat?._id || ""
      /* const lastMessageId =
        messages[selectedChatId || ""][
          messages[selectedChatId || ""].length - 1
        ]._id || ""
    */
      const token = await getToken()
      await deleteMessageService(
        {
          messageId,
          userId,
        },
        token
      )

      dispatch(deleteMessage({ chatId: selectedChatId || "", messageId }))
    } catch (error) {
      console.error("Error deleting message", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }

  return { sendNewMessage, deleteSelectedMessage }
}

export { useMessage }
