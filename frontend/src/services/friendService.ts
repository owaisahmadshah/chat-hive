import api from "@/lib/axiosInstance"

const getFriends = async () => {
  const { data } = await api.post("/v1/user/get-friends")
  return data
}

export { getFriends }
