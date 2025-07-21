import api from "@/lib/axiosInstance"

const fetchUser = async (identifier: { identifier: string }) => {
  const { data } = await api.post("/v1/user/suggestions", identifier)
  return data
}

const createChat = async (chatDetails: { admin: string; users: string[] }) => {
  const data = await api.post("/v1/chat/create", chatDetails)
  return data
}

const deleteChatService = async (deleteChat: { chatId: string }) => {
  const data = await api.delete("/v1/chat/delete", {
    data: deleteChat,
  })
  return data
}

const getUserChat = async (chatBody: { chatId: string }) => {
  const data = await api.post("/v1/chat/getupdatechat", chatBody)
  return data
}

export { fetchUser, createChat, deleteChatService, getUserChat }
