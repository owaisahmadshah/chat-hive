import api from "@/lib/axiosInstance"

const createFriend = async (
  friendData: { userId: string; friendId: string },
  token: string | null
) => {
  const { data } = await api.post("/v1/user/create-friend", friendData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const deleteFriend = async (
  friendData: { friendDocumentId: string },
  token: string | null
) => {
  const { data } = await api.post("/v1/user/delete-friend", friendData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export { createFriend, deleteFriend }
