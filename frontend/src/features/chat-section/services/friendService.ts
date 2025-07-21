import api from "@/lib/axiosInstance"

const createFriend = async (friendData: { friendId: string }) => {
  const { data } = await api.post("/v1/user/create-friend", friendData)
  return data
}

const deleteFriend = async (friendData: { friendDocumentId: string }) => {
  const { data } = await api.delete("/v1/user/delete-friend", {
    data: friendData,
  })
  return data
}

export { createFriend, deleteFriend }
