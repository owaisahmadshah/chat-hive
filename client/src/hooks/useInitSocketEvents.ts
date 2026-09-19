import { useQueryClient } from "@tanstack/react-query";
import { useSockets } from "@/context/socket/socket-context";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { useActiveChat } from "@/hooks/useActiveChat";
import { useUser } from "@/context/user-context";
import { useUpdateOneMessageStatus } from "@/features/messages/hooks/useUpdateOneMessageStatus";

import {
  addMessageToQuery,
  updateQueryMessageStatus,
  updateQueryMessagesStatus,
  type MessagesQueryData,
} from "@/features/messages/utils/message-cache-utils";

import {
  updateLastMessage,
  updateChatUnreadCount,
  addChatToFeed,
  updateChatTypingStatus,
  type ChatQueryData,
} from "@/features/chat/utils/chat-cache-utils";

import {
  SOCKET_EVENTS,
  type Message,
  type Chat,
  type MessageStatusEnum,
  type MessageStatus,
  type Typing,
  type User,
} from "shared";
import { useGetChat } from "@/features/chat/hooks/useGetChat";
import { useIfChatExists } from "./useIfChatExists";

export function useInitSocketEvents() {
  const queryClient = useQueryClient();
  const { chatSocket, globalSocket } = useSockets();
  const { chatId: activeChatId } = useActiveChat();
  const { hasChat } = useIfChatExists();
  const { mutateAsync: getChat } = useGetChat();
  const { state } = useUser();
  const currentUserId = state.user?.id;

  const updateOneMessageStatus = useUpdateOneMessageStatus();

  const newMessageOnChatOrUserSocket = async (newMessage: Message) => {
    if (!currentUserId) return;

    if (!hasChat(newMessage.chatId)) {
      const chat = (await getChat(newMessage.chatId)) as unknown as Chat;

      queryClient.setQueryData(
        ["chats"],
        (oldData: ChatQueryData | undefined) =>
          addChatToFeed({ oldData, newChat: chat }),
      );
    }

    const isChatActive =
      activeChatId === newMessage.chatId &&
      document.visibilityState === "visible";

    const nextStatus: MessageStatusEnum = isChatActive ? "read" : "delivered";

    // Append new message to target chat's infinite query
    queryClient.setQueryData(
      ["messages", newMessage.chatId],
      (oldData: MessagesQueryData | undefined) => {
        // ** It is important b/c if user hasn't opened it yet
        // ** we will lose all of his previous messages
        if (!oldData) return oldData;

        return addMessageToQuery({ oldData, message: newMessage });
      },
    );

    // Refresh last message timestamp on the feed
    queryClient.setQueryData(["chats"], (oldData: ChatQueryData | undefined) =>
      updateLastMessage({
        oldData,
        chatId: newMessage.chatId,
        updatedAt: new Date(newMessage.createdAt),
      }),
    );

    // Increment unread counter if chat is not currently open
    if (!isChatActive) {
      queryClient.setQueryData(
        ["chats"],
        (oldData: ChatQueryData | undefined) =>
          updateChatUnreadCount({
            oldData,
            chatId: newMessage.chatId,
            value: 1,
            increment: true,
          }),
      );
    }

    // Automatically emit status acknowledgement back to backend
    await updateOneMessageStatus(
      {
        messageId: newMessage.id,
        userId: currentUserId,
        status: nextStatus,
      },
      newMessage.chatId,
    );
  };

  // LISTEN FOR NEW MESSAGES ON CHAT SOCKET
  useSocketEvent<Message>(
    chatSocket,
    SOCKET_EVENTS.NEW_MESSAGE_CREATED,
    newMessageOnChatOrUserSocket,
  );

  // LISTEN FOR NEW MESSAGES ON GLOBAL SOCKET
  useSocketEvent<Message>(
    globalSocket,
    SOCKET_EVENTS.NEW_MESSAGE_CREATED,
    newMessageOnChatOrUserSocket,
  );

  // LISTEN FOR SINGLE MESSAGE STATUS CHANGES
  useSocketEvent<MessageStatus>(
    globalSocket,
    SOCKET_EVENTS.UPDATED_MESSAGE_STATUS,
    (updatedMessage) => {
      if (!updatedMessage) return;

      queryClient.setQueryData(
        ["messages", updatedMessage.chatId],
        (oldData: MessagesQueryData) =>
          updateQueryMessageStatus({
            oldData,
            messageId: updatedMessage.messageId,
            userId: updatedMessage.userId,
            status: updatedMessage.status,
          }),
      );
    },
  );

  // LISTEN FOR BULK CHAT MESSAGES STATUS CHANGES
  useSocketEvent<{
    chatId: string;
    receiver: string;
    status: MessageStatusEnum;
  }>(
    globalSocket,
    SOCKET_EVENTS.UPDATED_ALL_MESSAGES_STATUSES,
    ({ chatId, status }) => {
      queryClient.setQueryData(
        ["messages", chatId],
        (oldData: MessagesQueryData) =>
          updateQueryMessagesStatus({
            oldData,
            status,
            currentUserId: currentUserId ?? "",
          }),
      );
    },
  );

  // LISTEN FOR NEW CHAT CREATION (GROUP / DIRECT)
  useSocketEvent<Chat>(
    chatSocket,
    SOCKET_EVENTS.NEW_CHAT_CREATED,
    (newChat) => {
      queryClient.setQueryData(
        ["chats"],
        (oldData: ChatQueryData | undefined) =>
          addChatToFeed({ oldData, newChat }),
      );
    },
  );

  // LISTEN FOR GLOBAL USER PRESENCE CHANGES
  useSocketEvent<{ userId: string; status: string }>(
    globalSocket,
    "userPresenceChanged",
    ({ userId }) => {
      // Invalidate target user queries to update live presence badges
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  );

  // LISTEN FOR TYPING
  useSocketEvent<Typing>(chatSocket, SOCKET_EVENTS.RECEIVE_TYPING, (data) => {
    if (!data) return;

    if (data.userId === currentUserId) return;

    if (activeChatId === data.chatId) {
      queryClient.setQueryData(
        ["chat-user", data.userId],
        (oldData: User | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isTyping: data.isTyping,
          };
        },
      );
    }

    queryClient.setQueryData(["chats"], (oldData: ChatQueryData | undefined) =>
      updateChatTypingStatus({
        oldData,
        chatId: data.chatId,
        isTyping: data.isTyping,
      }),
    );
  });
}
