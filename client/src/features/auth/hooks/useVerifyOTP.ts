import { useMutation } from "@tanstack/react-query";
import { verifyOTPServ } from "../services/auth-services";

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOTPServ,
  });
};
