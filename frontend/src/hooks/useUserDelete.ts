import { deleteUser as deleteUserService } from "@/services/userService"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearUser } from "@/store/slices/user"

const useUserDelete = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const deleteUser = async () => {
    try {
      await deleteUserService()
      dispatch(clearUser())
      navigate("/sign-in")
    } catch (error) {
      console.error("Error deleting user", error)
    }
  }

  return { deleteUser }
}

export default useUserDelete
