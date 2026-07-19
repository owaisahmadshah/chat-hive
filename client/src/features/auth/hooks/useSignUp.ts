import { useMutation } from "@tanstack/react-query";
import { signUpServ } from "../services/auth-services";

export const useSignUp = () => {
  return useMutation({
    mutationFn: signUpServ,
  });
};
