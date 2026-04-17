import { useMutation } from "@tanstack/react-query"

import { changePassword } from "@/services/userService"

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    retry: false,
  })
}
