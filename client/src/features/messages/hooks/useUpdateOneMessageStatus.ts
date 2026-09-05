import { useQueryClient } from "@tanstack/react-query";
import { useChatActions } from "@/hooks/useChatActions";
import type { MessageStatus } from "shared";
import {
  updateQueryMessageStatus,
  type MessagesQueryData,
} from "../utils/message-cache-utils";

interface UpdateOneMessageStatusResult {
  success: boolean;
  error: null | string;
}

export const useUpdateOneMessageStatus = () => {
  const queryClient = useQueryClient();
  const { updateMessageStatus } = useChatActions();

  return async (
    payload: MessageStatus,
    chatId: string,
  ): Promise<UpdateOneMessageStatusResult> => {
    try {
      const updatedMessage = await updateMessageStatus(payload);

      if (!updatedMessage)
        return {
          success: false,
          error: "Failed to update message status. Socket not found.",
        };

      queryClient.setQueryData(
        ["messages", chatId],
        (oldData: MessagesQueryData | undefined) =>
          updateQueryMessageStatus({
            oldData,
            messageId: payload.messageId,
            userId: payload.userId,
            status: payload.status,
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
