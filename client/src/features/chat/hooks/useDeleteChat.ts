import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChatByIdServ } from "../services/chat-services";
import { useSearchParams } from "react-router-dom";
import { removeChatById, type ChatQueryData } from "../utils/chat-cache-utils";

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  const [params, setSearchParams] = useSearchParams();

  return useMutation({
    mutationFn: deleteChatByIdServ,
    onSuccess: (data: { chatId: string; message: string }) => {
      if (params.get("chatId") === data.chatId) {
        setSearchParams({});
      }

      queryClient.setQueryData(["chats"], (oldData: ChatQueryData) =>
        removeChatById({ oldData, chatId: data.chatId }),
      );

      // TODO: Remove all related messages
    },
  });
};
