import { useMutation } from "@tanstack/react-query";
import { logoutServ } from "../services/auth-services";

export const useSignOut = () => {
  return useMutation({
    mutationFn: logoutServ,
  });
};
