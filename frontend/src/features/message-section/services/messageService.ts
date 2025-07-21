import api from "@/lib/axiosInstance"

const sendMessage = async (formData: FormData) => {
  const { data } = await api.post("/v1/message/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}

const deleteMessageService = async (messageBody: { messageId: string }) => {
  const { data } = await api.delete("/v1/message/delete", {
    data: messageBody,
  })
  return data
}

const getChatMessagesService = async (chatBody: {
  chatId: string
  userChatMessages: number
}) => {
  const { data } = await api.post("/v1/chat/messages", chatBody)

  return data
}

export { sendMessage, deleteMessageService, getChatMessagesService }
