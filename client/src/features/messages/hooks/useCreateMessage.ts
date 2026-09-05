import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useChatActions } from "@/hooks/useChatActions";
import type { CreateMessage, Message, Pagination } from "shared";
import { addMessageToQuery } from "../utils/message-cache-utils";
import {
  updateChatUnreadCount,
  updateLastMessage,
  type ChatQueryData,
} from "@/features/chat/utils/chat-cache-utils";

interface UseCreateMessageResult {
  message: Message | null;
  error: string | null;
}

export type MessageQueryData = InfiniteData<Pagination<Message>, string | null>;

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  const { createMessage } = useChatActions();

  return async (data: CreateMessage): Promise<UseCreateMessageResult> => {
    try {
      const createdMessage = await createMessage(data);

      if (createdMessage) {
        const { chatId } = createdMessage;

        queryClient.setQueryData(
          ["messages", chatId],
          (oldData: MessageQueryData) =>
            addMessageToQuery({ oldData, message: createdMessage }),
        );

        queryClient.setQueryData(
          ["chats"],
          (oldData: ChatQueryData | undefined) =>
            updateLastMessage({
              oldData,
              chatId,
              updatedAt: new Date(createdMessage.createdAt),
            }),
        );

        queryClient.setQueryData(
          ["chats"],
          (oldData: ChatQueryData | undefined) =>
            updateChatUnreadCount({
              oldData,
              chatId,
              value: 0,
              increment: false,
            }),
        );
      }

      return { message: createdMessage, error: null };
    } catch (error) {
      console.error("Failed to send message:", error);
      return { message: null, error: "Unable to send message" };
    }
  };
};
