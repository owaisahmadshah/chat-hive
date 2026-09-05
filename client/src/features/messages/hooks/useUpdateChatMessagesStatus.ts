import { useQueryClient } from "@tanstack/react-query";
import { useChatActions } from "@/hooks/useChatActions";
import type { UpdateMessagesStatus } from "shared";
import {
  updateChatUnreadCount,
  type ChatQueryData,
} from "@/features/chat/utils/chat-cache-utils";
import {
  updateQueryMessagesStatus,
  type MessagesQueryData,
} from "../utils/message-cache-utils";

interface UpdateOneMessageStatusResult {
  success: boolean;
  error: null | string;
}

export const useUpdateChatMessagesStatus = () => {
  const queryClient = useQueryClient();
  const { updateChatMessagesStatus } = useChatActions();

  return async (
    payload: UpdateMessagesStatus,
  ): Promise<UpdateOneMessageStatusResult> => {
    try {
      const updatedChat = await updateChatMessagesStatus(payload);

      if (!updatedChat)
        return {
          success: false,
          error: "Failed to update chat messages status. Socket not found.",
        };

      const currentUserId = payload.userId;
      if (currentUserId) {
        queryClient.setQueryData(
          ["messages", payload.chatId],
          (oldData: MessagesQueryData | undefined) =>
            updateQueryMessagesStatus({
              oldData,
              status: payload.status,
              currentUserId: currentUserId,
            }),
        );
      } else {
        console.error("Current user not found");
      }

      queryClient.setQueryData(
        ["chats"],
        (oldData: ChatQueryData | undefined) =>
          updateChatUnreadCount({
            oldData,
            chatId: payload.chatId,
            value: 0,
            increment: payload.status === "read" ? false : true,
          }),
      );

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Something went wrong",
      };
    }
  };
};
