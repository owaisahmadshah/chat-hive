import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { z } from "zod"

import { messageSchema } from "../types/message-schema"
import { addMessage, deleteMessage } from "@/store/slices/messages"
import { RootState } from "@/store/store"
import {
  deleteMessageService,
  getAndUpdateChat,
  sendMessage,
} from "../services/messageService"
import { useAuth } from "@clerk/clerk-react"
import { updateChat } from "@/store/slices/chats"
import { useSocketService } from "@/hooks/useSocketService"

const useMessage = () => {
  const dispatch = useDispatch()
  const { getToken } = useAuth()
  const { sendSocketMessage, newSocketChat } = useSocketService()

  const userId = useSelector((state: RootState) => state.user.userId)
  const { selectedChat } = useSelector((state: RootState) => state.chats)
  const messages = useSelector((state: RootState) => state.messages)

  const sendNewMessage = async (values: z.infer<typeof messageSchema>) => {
    try {
      if (!selectedChat) {
        return
      }
      const messageData = {
        sender: userId,
        chatId: selectedChat?._id,
        message: values.userInputMessage,
        status: "sent",
      }

      const token = await getToken()
      const data = await sendMessage(messageData, token)

      const newMessage = {
        chatId: selectedChat?._id,
        message: data.data.filteredMessage,
      }

      dispatch(addMessage(newMessage))
      dispatch(
        updateChat({
          chatId: selectedChat?._id,
          updates: {
            lastMessage: {
              message: data.data.filteredMessage.message,
              photoUrl: data.data.filteredMessage.photoUrl,
            },
            updatedAt: data.data.filteredMessage.updatedAt,
          },
        })
      )

      if (messages[selectedChat?._id].length !== 0) {
        sendSocketMessage(selectedChat?._id, data.data.filteredMessage)
        return
      }

      await getAndUpdateChat({ chatId: selectedChat?._id }, token)

      newSocketChat(selectedChat)
      sendSocketMessage(selectedChat?._id, data.data.filteredMessage)
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
          // chatId: selectedChatId,
          messageId,
          // lastMessageId,
          userId,
        },
        token
      )

      /*
      const messageIndex = messages[selectedChatId || ""].findIndex(
        (msg) => msg._id === messageId
      )

      if (messageIndex === messages[selectedChatId || ""].length) {
        dispatch(
          updateChat({
            chatId: selectedChatId || "",
            updates: {
              lastMessage: {
                message:
                  messages[selectedChatId || ""][messageIndex - 1]?.message ||
                  "",
                photoUrl: "",
              },
              updatedAt:
                messages[selectedChatId || ""][messageIndex - 1]?.updatedAt ||
                selectedChat?.updatedAt,
            },
          })
        )
      }
      */
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
