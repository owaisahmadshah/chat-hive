import api from "@/lib/axiosInstance"

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

export { updateMessagesStatusService, updateMessageStatusService }
