import api from "@/lib/axiosInstance"

const getRecommendedUsers = async (pagination: {
  limit: number
  cursor: string | null
}) => {
  const { data } = await api.get("/v1/user/recommended-users", {
    params: pagination,
  })
  return data.data
}

const createConnection = async (connectionData: { receiverId: string }) => {
  const { data } = await api.post("/v1/connection/create", connectionData)

  return data.data
}

const deleteConnection = async ({ connectionId }: { connectionId: string }) => {
  const { data } = await api.delete(`/v1/connection/delete/${connectionId}`)
  return data.data
}

const getConnections = async (pagination: {
  limit: number
  cursor: string | null
}) => {
  const { data } = await api.get("/v1/connection/get-connections", {
    params: pagination,
  })
  return data.data
}

export {
  getRecommendedUsers,
  createConnection,
  deleteConnection,
  getConnections,
}
