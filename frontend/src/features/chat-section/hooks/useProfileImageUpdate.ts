import { updateProfilePicture } from "@/services/userService"
import { setUser } from "@/store/slices/user"
import { User } from "@/types/user-interface"
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"

export const useProfileImageUpdate = () => {
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: (data) => {
      console.log(data)
      const payload: User = {
        email: data.data.email,
        username: data.data.username,
        userId: data.data._id,
        imageUrl: data.data.imageUrl,
        isLoading: false,
        isSignedIn: true,
      }
      dispatch(setUser(payload))
    },
  })
}
