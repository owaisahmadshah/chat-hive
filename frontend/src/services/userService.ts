import api from "@/lib/axiosInstance"

const getUser = async (clerkId: string) => {
  const { data } = await api.post("/v1/webhook/user", { clerkId })

  return data
}

export { getUser }
