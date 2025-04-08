import api from "@/lib/axiosInstance"

const fetchUser = async (email: { email: string }) => {
  const { data } = await api.post("/v1/webhook/suggestions", email)
  return data
}

const createChat = async (chatDetails: { admin: string; users: string[] }) => {
  const data = await api.post("/v1/chat/create", chatDetails)
  return data
}

const deleteChatService = async (deleteChat: {
  userId: string
  chatId: string
}) => {
  const data = await api.post("/v1/chat/delete", deleteChat)
  return data
}

const getUserChat = async (chatBody: { chatId: string }) => {
  const data = await api.post("/v1/chat/getupdatechat", chatBody)
  return data
}

export { fetchUser, createChat, deleteChatService, getUserChat }
