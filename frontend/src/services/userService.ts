import api from "@/lib/axiosInstance"

const getUser = async () => {
  const { data } = await api.post("/v1/user/user")
  return data
}

const deleteUser = async () => {
  const { data } = await api.delete("/v1/user/delete")
  return data
}

export { getUser, deleteUser }
