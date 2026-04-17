import api from "@/lib/axiosInstance"
import { TChangePassword } from "shared"

const getUser = async () => {
  const { data } = await api.post("/v1/user/user")
  return data
}

const deleteUser = async () => {
  const { data } = await api.delete("/v1/user/delete")
  return data
}

const signOutUser = async () => {
  const { data } = await api.post("/v1/user/sign-out")
  return data
}

const updateProfilePicture = async (data: FormData) => {
  const response = await api.patch("/v1/user/update-profile-image", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

const changePassword = async (data: TChangePassword) => {
  const response = await api.patch("/v1/user/change-password", data)

  return response.data
}

export {
  getUser,
  deleteUser,
  signOutUser,
  updateProfilePicture,
  changePassword,
}
