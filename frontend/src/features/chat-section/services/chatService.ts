import api from "@/lib/axiosInstance"

const fetchUser = async (username: { username: string }) => {
  const { data } = await api.post("/v1/user/suggestions", username)
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
  const { data } = await api.post("/v1/chat/getupdatechat", chatBody)
  return data.data
}

const fetchUserChats = async (pagination: {
  limit: number
  cursor: string | null
}) => {
  const { data } = await api.get("/v1/chat/chats", { params: pagination })

  return data.data
}

export { fetchUser, createChat, deleteChatService, getUserChat, fetchUserChats }
