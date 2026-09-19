import { useMutation } from "@tanstack/react-query";
import { logoutServ } from "../services/auth-services";
import { useUser } from "@/context/user-context";

export const useSignOut = () => {
  const { clearUser } = useUser();

  return useMutation({
    mutationFn: logoutServ,
    onSuccess: () => {
      clearUser();
    },
  });
};
