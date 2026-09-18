import { useUser } from "@/context/user-context";
import { profileImageUrlServ } from "@/services/global-services";
import { useMutation } from "@tanstack/react-query";
import type { User } from "shared";

export const useUserProfilePicture = () => {
  const { setUser } = useUser();
  return useMutation({
    mutationFn: profileImageUrlServ,
    onSuccess: (data: User) => {
      setUser(data);
    },
  });
};
