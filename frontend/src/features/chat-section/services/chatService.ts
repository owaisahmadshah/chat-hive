import api from "@/lib/axiosInstance"

const fetchUser = async (identifier: { identifier: string }, token: string | null) => {
  const { data } = await api.post("/v1/user/suggestions", identifier, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const createChat = async (
  chatDetails: { admin: string; users: string[] },
  token: string | null
) => {
  const data = await api.post("/v1/chat/create", chatDetails, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const deleteChatService = async (
  deleteChat: {
    userId: string
    chatId: string
  },
  token: string | null
) => {
  const data = await api.post("/v1/chat/delete", deleteChat, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const getUserChat = async (
  chatBody: { chatId: string },
  token: string | null
) => {
  const data = await api.post("/v1/chat/getupdatechat", chatBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export { fetchUser, createChat, deleteChatService, getUserChat }
