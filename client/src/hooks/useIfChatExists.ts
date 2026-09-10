import type { ChatQueryData } from "@/features/chat/utils/chat-cache-utils";
import { useQueryClient } from "@tanstack/react-query";

export const useIfChatExists = () => {
  const queryClient = useQueryClient();

  const hasChat = (chatId: string): boolean => {
    const chats =
      queryClient
        .getQueryData<ChatQueryData | undefined>(["chats"])
        ?.pages.flatMap((page) => page.data) ?? [];

    if (!chats) return false;

    for (let i = 0; i < chats.length; i++) {
      if (chatId == chats[i].id) return true;
    }

    return false;
  };

  return { hasChat };
};
