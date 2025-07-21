import api from "@/lib/axiosInstance"
import { TUpdateUserField } from "../schemas/userSchema"

export const updateUserFields = async (updateData: TUpdateUserField) => {
  const { data } = await api.post("/v1/user/update-user-fields", updateData)
  return data
}
