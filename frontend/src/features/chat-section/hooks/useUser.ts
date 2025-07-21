import { useDispatch } from "react-redux"

import { TUpdateUserField } from "../schemas/userSchema"
import { updateUserFields } from "../services/userService"
import { setUser } from "@/store/slices/user"

const useUser = () => {
  const dispatch = useDispatch()

  const updateUserField = async (updateData: TUpdateUserField) => {
    const { data } = await updateUserFields({ ...updateData })
    dispatch(setUser(data))
  }

  return { updateUserField }
}

export { useUser }
