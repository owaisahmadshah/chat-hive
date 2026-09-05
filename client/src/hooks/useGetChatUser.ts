import { chatUserServ } from "@/services/global-services";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetChatUser = (userId: string) => {
  return useSuspenseQuery({
    queryKey: ["chat-user", userId],
    queryFn: () => chatUserServ(userId),
  });
};
