import { useMutation } from "@tanstack/react-query";
import { resendOTPServ } from "../services/auth-services";

export const useResendOTP = () => {
  return useMutation({
    mutationFn: resendOTPServ,
  });
};
