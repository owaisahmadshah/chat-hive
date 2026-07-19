import { useMutation } from "@tanstack/react-query";
import { signInServ } from "../services/auth-services";

export const useSignIn = () => {
  return useMutation({
    mutationFn: signInServ,
  });
};
