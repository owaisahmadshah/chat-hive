import { useAuth } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"

import { deleteUser as deleteUserService } from "@/services/userService"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useNavigate } from "react-router-dom"

const useUserDelete = () => {
  const { getToken } = useAuth()
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  const userId = useSelector((state: RootState) => state.user.userId)

  const deleteUser = async () => {
    if (!isLoaded) {
      return
    }

    const token = await getToken()

    try {
      await deleteUserService(user?.id ?? "", userId, token)
      navigate("/")
    } catch (error) {
      console.error("Error deleting user", error)
    }
  }

  return { deleteUser }
}

export default useUserDelete
