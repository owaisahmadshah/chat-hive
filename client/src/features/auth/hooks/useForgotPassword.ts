import { useMutation } from "@tanstack/react-query";
import { forgotPasswordServ } from "../services/auth-services";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordServ,
  });
};
