import api from "@/lib/axiosInstance"
import { TUpdateUserField } from "../schemas/userSchema"

export const updateUserFields = async (
  updateData: TUpdateUserField & { userId: string },
  token: string | null
) => {
  const { data } = await api.post("/v1/user/update-user-fields", updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}
