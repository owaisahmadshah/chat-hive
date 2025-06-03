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

const deleteUser = async (
  clerkId: string,
  userId: string,
  token: string | null
) => {
  const { data } = await api.delete("/v1/user/delete", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { userId, clerkId },
  })

  return data
}

export { getUser, deleteUser }
