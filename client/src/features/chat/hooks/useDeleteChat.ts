import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChatByIdServ } from "../services/chat-services";
import { useSearchParams } from "react-router-dom";
import { removeChatById, type ChatQueryData } from "../utils/chat-cache-utils";
import { useChatActions } from "@/hooks/useChatActions";

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  const [params, setSearchParams] = useSearchParams();
  const { leaveChat } = useChatActions();

  return useMutation({
    mutationFn: deleteChatByIdServ,
    onSuccess: (data: { chatId: string; message: string }) => {
      if (params.get("chatId") === data.chatId) {
        setSearchParams({});
      }

      queryClient.setQueryData(["chats"], (oldData: ChatQueryData) =>
        removeChatById({ oldData, chatId: data.chatId }),
      );

      queryClient.invalidateQueries({ queryKey: ["messages", data.chatId] });

      leaveChat(data.chatId);
    },
  });
};
