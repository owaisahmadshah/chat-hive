import { useDispatch } from "react-redux"

import {
  createFriend as createFriendService,
  deleteFriend as deleteFriendService,
} from "../services/friendService"
import { addFriend, deleteFriend } from "@/store/slices/friend"

const useFriend = () => {
  const dispatch = useDispatch()

  const createUser = async (friendId: string) => {
    const userData = {
      friendId,
    }

    try {
      const { data } = await createFriendService(userData)

      dispatch(addFriend(data.friend))
    } catch (error) {
      console.error("Error while creating friend", error)
    }
  }

  const deleteUser = async (friendDocumentId: string) => {
    try {
      await deleteFriendService({ friendDocumentId })
      dispatch(deleteFriend(friendDocumentId))
    } catch (error) {
      console.error("Error while deleting friend", error)
    }
  }

  return { createUser, deleteUser }
}

export default useFriend
