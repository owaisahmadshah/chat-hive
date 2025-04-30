import { useAuth } from "@clerk/clerk-react"
import { useDispatch, useSelector } from "react-redux"

import { RootState } from "@/store/store"
import {
  createFriend as createFriendService,
  deleteFriend as deleteFriendService,
} from "../services/friendService"
import { addFriend, deleteFriend } from "@/store/slices/friend"

const useFriend = () => {
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const { userId } = useSelector((state: RootState) => state.user)

  const createUser = async (friendId: string) => {
    const token = await getToken()
    const userData = {
      userId,
      friendId,
    }

    try {
      const { data } = await createFriendService(userData, token)

      dispatch(addFriend(data.friend))
    } catch (error) {
      console.error("Error while creating friend", error)
    }
  }

  const deleteUser = async (friendDocumentId: string) => {
    const token = await getToken()
    try {
      await deleteFriendService({ friendDocumentId }, token)
      dispatch(deleteFriend(friendDocumentId))
    } catch (error) {
      console.error("Error while deleting friend", error)
    }
  }

  return { createUser, deleteUser }
}

export default useFriend
