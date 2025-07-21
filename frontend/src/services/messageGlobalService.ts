import api from "@/lib/axiosInstance"

const updateMessagesStatusService = async (updateBody: {
  chatId: string
  status: "receive" | "seen"
}) => {
  const { data } = await api.post("/v1/message/updatestatus", updateBody)
  return data
}

const updateMessageStatusService = async (updateBody: {
  messageId: string
  status: "receive" | "seen"
}) => {
  const { data } = await api.post("/v1/message/updateonestatus", updateBody)
  return data
}

export { updateMessagesStatusService, updateMessageStatusService }
