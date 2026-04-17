import { useMutation } from "@tanstack/react-query"

import { verifyOtpAndResetPassword } from "@/features/auth/services/authService"

export const useVerifyOtpAndChangePassword = () => {
  return useMutation({
    mutationFn: verifyOtpAndResetPassword,
  })
}
