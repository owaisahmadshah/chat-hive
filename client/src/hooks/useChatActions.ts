import { useCallback } from "react";
import { useSockets } from "../context/socket/socket-context";
import {
  SOCKET_EVENTS,
  type Chat,
  type CreateChat,
  type CreateMessage,
  type MessageStatus,
} from "shared";

export function useChatActions() {
  const { chatSocket, globalSocket } = useSockets();

  // Chat Gateway Emitters

  const createChat = useCallback(
    async (payload: CreateChat): Promise<Chat> => {
      if (!chatSocket) throw new Error("Chat socket not connected");
      return await chatSocket.emitWithAck(
        SOCKET_EVENTS.CREATE_NEW_CHAT,
        payload,
      );
    },
    [chatSocket],
  );

  const createMessage = useCallback(
    async (payload: CreateMessage) => {
      if (!chatSocket) throw new Error("Chat socket not connected");
      return await chatSocket.emitWithAck(
        SOCKET_EVENTS.CREATE_NEW_MESSAGE,
        payload,
      );
    },
    [chatSocket],
  );

  const joinChat = useCallback(
    async (chatId: string) => {
      if (!chatSocket) return;
      return await chatSocket.emitWithAck(SOCKET_EVENTS.JOIN_CHAT, { chatId });
    },
    [chatSocket],
  );

  const leaveChat = useCallback(
    async (chatId: string) => {
      if (!chatSocket) return;
      return await chatSocket.emitWithAck(SOCKET_EVENTS.LEAVE_CHAT, { chatId });
    },
    [chatSocket],
  );

  const updateMessageStatus = useCallback(
    async (payload: MessageStatus) => {
      if (!chatSocket) return;
      return await chatSocket.emitWithAck(
        SOCKET_EVENTS.UPDATE_MESSAGE_STATUS,
        payload,
      );
    },
    [chatSocket],
  );

  // Presence Gateway Emitters

  const checkUserPresence = useCallback(
    async (targetUserId: string) => {
      if (!globalSocket) return null;
      return await globalSocket.emitWithAck("checkUserPresence", {
        targetUserId,
      });
    },
    [globalSocket],
  );

  const updateStatus = useCallback(
    async (status: "online" | "offline") => {
      if (!globalSocket) return;
      return await globalSocket.emitWithAck("updateStatus", { status });
    },
    [globalSocket],
  );

  return {
    createChat,
    createMessage,
    joinChat,
    leaveChat,
    updateMessageStatus,
    checkUserPresence,
    updateStatus,
  };
}
