import api from "@/lib/axiosInstance"

export const fetchChatUser = async (params: { userId: string }) => {
  const { data } = await api.get("/v1/user/chat-user", {
    params,
  })

  return data.data
}
