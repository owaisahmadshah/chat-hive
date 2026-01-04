import api from "@/lib/axiosInstance"

const getRecommendedUsers = async () => {
  const { data } = await api.get("/v1/user/recommended-users")
  return data
}

export { getRecommendedUsers }
