import { useDispatch, useSelector } from "react-redux"
import { useAuth } from "@clerk/clerk-react"

import { RootState } from "@/store/store"
import { TUpdateUserField } from "../schemas/userSchema"
import { updateUserFields } from "../services/userService"
import { setUser } from "@/store/slices/user"

const useUser = () => {
  const { getToken } = useAuth()

  const dispatch = useDispatch()

  const userId = useSelector((state: RootState) => state.user.userId)

  const updateUserField = async (updateData: TUpdateUserField) => {
    const token = await getToken()
    const { data } = await updateUserFields({ ...updateData, userId }, token)
    dispatch(setUser(data))
  }

  return { updateUserField }
}

export { useUser }
