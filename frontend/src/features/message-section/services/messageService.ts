import api from "@/lib/axiosInstance"

const sendMessage = async (messageBody: any, token: string | null) => {
  const { data } = await api.post("/v1/message/create", messageBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const deleteMessageService = async (
  messageBody: {
    // chatId: string
    messageId: string
    // lastMessageId: string
    userId: string
  },
  token: string | null
) => {
  const { data } = await api.post("/v1/message/delete", messageBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const getAndUpdateChat = async (
  chatBody: {
    chatId: string
  },
  token: string | null
) => {
  const { data } = await api.post("/v1/chat/getupdatechat", chatBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export { sendMessage, deleteMessageService, getAndUpdateChat }
