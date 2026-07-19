import { useMutation } from "@tanstack/react-query";
import { newPasswordServ } from "../services/auth-services";

export const useNewPassword = () => {
  return useMutation({
    mutationFn: newPasswordServ,
  });
};
