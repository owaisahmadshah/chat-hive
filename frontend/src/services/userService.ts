import api from "@/lib/axiosInstance"

const getUser = async (clerkId: string, token: string | null) => {
  const { data } = await api.post(
    "/v1/user/user",
    { clerkId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return data
}

export { getUser }
