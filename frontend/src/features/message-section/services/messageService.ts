import api from "@/lib/axiosInstance"

const sendMessage = async (formData: FormData, token: string | null) => {
  const { data } = await api.post("/v1/message/create", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}

const deleteMessageService = async (
  messageBody: {
    messageId: string
    userId: string
  },
  token: string | null
) => {
  const { data } = await api.delete("/v1/message/delete", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: messageBody,
  })
  return data
}

const getChatMessagesService = async (
  chatBody: {
    chatId: string
    userId: string
    userChatMessages: number
  },
  token: string | null
) => {
  const { data } = await api.post("/v1/chat/messages", chatBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return data
}

export { sendMessage, deleteMessageService, getChatMessagesService }
