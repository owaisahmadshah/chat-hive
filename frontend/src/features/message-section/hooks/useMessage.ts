import { useDispatch, useSelector } from "react-redux"
import axios from "axios"

import { addMessage, deleteMessage, setMessages } from "@/store/slices/messages"
import { RootState } from "@/store/store"
import {
  deleteMessageService,
  getChatMessagesService,
  sendMessage,
} from "../services/messageService"
import { setSelectedChat, updateChat } from "@/store/slices/chats"
import { useSocketService } from "@/hooks/useSocketService"
import { useRef } from "react"
import { Message } from "shared"

const useMessage = () => {
  const dispatch = useDispatch()

  const userId = useSelector((state: RootState) => state.user.userId)
  const { selectedChat } = useSelector((state: RootState) => state.chats)
  const { sendSocketMessage } = useSocketService()
  const allMessages = useSelector((state: RootState) => state.messages)

  const selectedChatRef = useRef(selectedChat)
  selectedChatRef.current = selectedChat

  const allMessagesRef = useRef(allMessages)
  allMessagesRef.current = allMessages

  const sendNewMessage = async (formData: FormData) => {
    if (!selectedChatRef.current) {
      return
    }

    try {
      const selectedChatId = selectedChatRef.current._id

      formData.append("sender", userId)
      formData.append("chatId", selectedChatId)
      formData.append(
        "status",
        selectedChatRef.current.users.length === 1 ? "seen" : "sent"
      ) // If user.length === 1 then we are sending message to self, so status is seen otherwise sent

      const data = await sendMessage(formData)

      const messages = data.data.messages

      // Adding messages one by one
      messages.forEach((message: Message) => {
        const newMessage = {
          chatId: selectedChatId,
          message: message,
        }

        dispatch(addMessage(newMessage))
        dispatch(
          updateChat({
            chatId: selectedChatId,
            updates: {
              updatedAt: message.updatedAt,
              lastMessage: {
                isPhoto: message.photoUrl !== "",
                message: message.message,
              },
              unreadMessages: 0,
            },
          })
        )
      })

      dispatch(
        setSelectedChat({ ...selectedChatRef.current, unreadMessages: 0 })
      )

      const messageUsers = selectedChatRef.current?.users?.map((u) => u._id)

      // Sending message one by one using socket
      messages.forEach((message: Message) => {
        sendSocketMessage(message, messageUsers)
      })
    } catch (error) {
      console.error("Error sending message", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }

  const deleteSelectedMessage = async (messageId: string) => {
    if (!selectedChatRef.current) {
      return
    }

    try {
      const selectedChatId = selectedChatRef.current?._id

      await deleteMessageService({
        messageId,
      })

      const chatMessages = allMessagesRef.current[selectedChatId]
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
            chatId: selectedChatId,
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

  const getChatMessages = async (chatId: string) => {
    if (!selectedChatRef.current) {
      return
    }

    try {
      const { data } = await getChatMessagesService({
        chatId,
        userChatMessages:
          allMessagesRef.current[selectedChatRef.current?._id].length,
      })

      dispatch(
        setMessages({
          chatId,
          messages: [...data, ...allMessagesRef.current[chatId]],
        })
      )
    } catch (error) {
      console.error("Error deleting message", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }

  return { sendNewMessage, deleteSelectedMessage, getChatMessages }
}

export { useMessage }
