import api from "@/lib/axiosInstance"

const sendMessage = async (messageBody: any, token: string | null) => {
  const { data } = await api.post("/v1/message/create", messageBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export { sendMessage }
