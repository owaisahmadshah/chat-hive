import api from "@/lib/axiosInstance"

const fetchUser = async (messageBody: any, token: string | null) => {
  const { data } = await api.post("/v1/webhook/suggestions", messageBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export { fetchUser }
