import { useMutation } from "@tanstack/react-query";
import { resetPasswordServ } from "../services/auth-services";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordServ,
  });
};
