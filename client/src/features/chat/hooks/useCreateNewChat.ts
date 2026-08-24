import { useChatActions } from "@/hooks/useChatActions";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import type { CreateChat } from "shared";
import { addChatToFeed, type ChatQueryData } from "../utils/chat-cache-utils";

export const useCreateNewChat = () => {
  const queryClient = useQueryClient();
  const [, setSearchParams] = useSearchParams();

  const { createChat } = useChatActions();

  return async (data: CreateChat) => {
    const newChat = await createChat(data);
    queryClient.setQueryData(["chats"], (oldData: ChatQueryData) =>
      addChatToFeed({ oldData, newChat }),
    );

    if (newChat.isGroup) {
      setSearchParams({ chatId: newChat.id });
      return newChat;
    }

    const receiver = newChat.members.filter(
      (receiver) => receiver.id != data.createdBy,
    );

    setSearchParams({ chatId: newChat.id, userId: receiver[0].id });

    return newChat;
  };
};
