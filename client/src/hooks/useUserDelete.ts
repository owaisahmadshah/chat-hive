import { userDeleteServ } from "@/services/global-services";
import { useMutation } from "@tanstack/react-query";

export function useUserDelete() {
  return useMutation({
    mutationFn: userDeleteServ,
  });
}
