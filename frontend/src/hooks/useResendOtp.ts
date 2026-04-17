import { useMutation } from "@tanstack/react-query"

import { resendOtpService } from "@/features/auth/services/authService"

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtpService,
  })
}
