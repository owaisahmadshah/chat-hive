import api from "@/lib/axiosInstance"

const getFriends = async (
  userData: { userId: string },
  token: string | null
) => {
  const { data } = await api.post("/v1/user/get-friends", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export { getFriends }
