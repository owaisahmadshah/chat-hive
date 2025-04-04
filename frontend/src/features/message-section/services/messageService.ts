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
  const { data } = await api.post("/v1/message/delete", messageBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const updateMessagesStatusService = async (
  updateBody: {
    chatId: string
    userId: string
    status: "receive" | "seen"
  },
  token: string | null
) => {
  const { data } = await api.post("/v1/message/updatestatus", updateBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const updateMessageStatusService = async (
  updateBody: {
    userId: string
    messageId: string
    status: "receive" | "seen"
  },
  token: string | null
) => {
  const { data } = await api.post("/v1/message/updateonestatus", updateBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export {
  sendMessage,
  deleteMessageService,
  updateMessagesStatusService,
  updateMessageStatusService,
}
