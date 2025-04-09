import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"

import { addMessage, deleteMessage } from "@/store/slices/messages"
import { RootState } from "@/store/store"
import { deleteMessageService, sendMessage } from "../services/messageService"
import { setSelectedChat, updateChat } from "@/store/slices/chats"
import { useSocketService } from "@/hooks/useSocketService"

const useMessage = () => {
  const { getToken } = useAuth()

  const dispatch = useDispatch()

  const userId = useSelector((state: RootState) => state.user.userId)
  const { selectedChat } = useSelector((state: RootState) => state.chats)
  const { sendSocketMessage } = useSocketService()
  const allMessages = useSelector((state: RootState) => state.messages)

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
            lastMessage: {
              isPhoto: data.data.filteredMessage.photoUrl !== "",
              message: data.data.filteredMessage.message,
            },
          },
        })
      )

      dispatch(setSelectedChat({ ...selectedChat, unreadMessages: 0 }))

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
    if (!selectedChat?._id) {
      return
    }

    try {
      const token = await getToken()

      const selectedChatId = selectedChat?._id
      /* const lastMessageId =
        messages[selectedChatId || ""][
          messages[selectedChatId || ""].length - 1
        ]._id || ""
    */
      await deleteMessageService(
        {
          messageId,
          userId,
        },
        token
      )

      const chatMessages = allMessages[selectedChat._id]
      const lastMessage = {
        isPhoto: false,
        message: "",
      }

      // If we have one message and we are deleting it, then we can't go into if
      if (chatMessages.length - 1) {
        lastMessage.isPhoto =
          chatMessages[chatMessages.length - 2].photoUrl !== ""
        lastMessage.message = chatMessages[chatMessages.length - 2].message
      }

      dispatch(deleteMessage({ chatId: selectedChatId, messageId }))
      // If we are deleting last message then we will update lastMessage
      if (messageId === chatMessages[chatMessages.length - 1]._id) {
        dispatch(
          updateChat({
            chatId: selectedChat?._id,
            updates: {
              lastMessage,
            },
          })
        )
      }
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
