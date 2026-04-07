import { signOutUser } from "@/services/userService"
import { clearUser } from "@/store/slices/user"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { useSearchParams } from "react-router-dom"

export const useSignOutUser = () => {
  const [, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const dispatch = useDispatch()

  return useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      queryClient.clear()
      setSearchParams({})
      dispatch(clearUser())
    },
  })
}
