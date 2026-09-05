import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessageServ } from "../services/message-services";
import {
  deleteMessageFromQuery,
  type MessagesQueryData,
} from "../utils/message-cache-utils";
import {
  updateChatAfterMessageDelete,
  type ChatQueryData,
} from "@/features/chat/utils/chat-cache-utils";

interface DeleteMessageVariables {
  messageId: string;
  chatId: string;
}

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId }: DeleteMessageVariables) =>
      deleteMessageServ(messageId),
    onSuccess: (_, variables) => {
      const { messageId, chatId } = variables;

      // Get current messages before updating cache to check if the deleted message was the last message
      const messagesData = queryClient.getQueryData<MessagesQueryData>([
        "messages",
        chatId,
      ]);

      const allMessages =
        messagesData?.pages.flatMap((page) => page.data) ?? [];
      const isLastMessage = allMessages[0]?.id === messageId;

      // Determine the new latest message date if the deleted message was at the top
      const secondLastMessage = isLastMessage ? allMessages[1] : null;
      const fallbackDate = secondLastMessage
        ? new Date(secondLastMessage.createdAt)
        : undefined;

      // Remove the message from the messages query cache
      queryClient.setQueryData(
        ["messages", chatId],
        (oldData: MessagesQueryData | undefined) =>
          deleteMessageFromQuery({ oldData, messageId }),
      );

      // Update the chat feed (reset unread count to 0 and update updatedAt if the last message was removed)
      queryClient.setQueryData(
        ["chats"],
        (oldData: ChatQueryData | undefined) =>
          updateChatAfterMessageDelete({
            oldData,
            chatId,
            fallbackLastMessageDate: fallbackDate,
          }),
      );
    },
  });
};
