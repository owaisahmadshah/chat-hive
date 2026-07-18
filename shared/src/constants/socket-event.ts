export const SOCKET_EVENTS = {
  // PRESENCE
  CHECK_USER_PRESENCE: "checkUserPresence",
  UPDATE_PRESENCE: "updatePresence",

  // CHAT
  CREATE_NEW_CHAT: "newChat",
  JOIN_CHAT: "joinChat",
  LEAVE_CHAT: "leaveChat",
  NEW_CHAT_CREATED: "newChatCreated",

  // MESSAGE
  CREATE_NEW_MESSAGE: "newMessage",
  NEW_MESSAGE_CREATED: "newMessageCreated",
  UPDATE_MESSAGE_STATUS: "updateMessageStatus",
  UPDATE_ALL_MESSAGES_STATUSES: "updateAllMessagesStatuses",
  UPDATED_MESSAGE_STATUS: "updatedMessageStatus",
  UPDATED_ALL_MESSAGES_STATUSES: "updatedAllMessagesStatuses",
};
