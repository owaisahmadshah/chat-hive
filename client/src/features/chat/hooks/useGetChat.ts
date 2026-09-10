import { useMutation } from "@tanstack/react-query";
import { getChatByIdServ } from "../services/chat-services";

export const useGetChat = () => {
  return useMutation({
    mutationKey: ["single-chat"],
    mutationFn: (chatId: string) => getChatByIdServ(chatId),
  });
};
