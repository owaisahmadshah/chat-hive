import type { InfiniteData } from "@tanstack/react-query";
import type { Message, MessageStatusEnum, Pagination } from "shared";

export type MessagesQueryData = InfiniteData<
  Pagination<Message>,
  string | null
>;

export const addMessageToQuery = ({
  oldData,
  message,
}: {
  oldData?: MessagesQueryData;
  message: Message;
}): MessagesQueryData => {
  if (!oldData || oldData.pages.length === 0) {
    return {
      pageParams: [null],
      pages: [
        {
          data: [message],
          nextCursor: null,
          hasMore: false,
        },
      ],
    };
  }

  return {
    ...oldData,
    pages: oldData.pages.map((page, index) => {
      if (index === 0) {
        // Filter out duplicate if message already exists
        const filtered = page.data.filter((m) => m.id !== message.id);
        return {
          ...page,
          data: [message, ...filtered],
        };
      }
      return page;
    }),
  };
};

export const deleteMessageFromQuery = ({
  oldData,
  messageId,
}: {
  oldData?: MessagesQueryData;
  messageId: string;
}): MessagesQueryData | undefined => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.filter((message) => message.id !== messageId),
    })),
  };
};

export const updateQueryMessageStatus = ({
  oldData,
  messageId,
  userId,
  status,
}: {
  oldData?: MessagesQueryData;
  messageId: string;
  userId?: string;
  status: MessageStatusEnum;
}): MessagesQueryData | undefined => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.map((message) => {
        if (message.id !== messageId) return message;

        const updatedStatuses = message.statuses.map((s) => {
          if (!userId || s.userId === userId) {
            return { ...s, status };
          }
          return s;
        });

        return {
          ...message,
          statuses: updatedStatuses,
        };
      }),
    })),
  };
};

export const updateQueryMessagesStatus = ({
  oldData,
  status,
  currentUserId,
}: {
  oldData?: MessagesQueryData;
  status: MessageStatusEnum;
  currentUserId: string;
}): MessagesQueryData | undefined => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.map((message) => {
        if (message.sender.id !== currentUserId) return message;

        const updatedStatuses = message.statuses.map((s) => ({
          ...s,
          status,
        }));

        return {
          ...message,
          statuses: updatedStatuses,
        };
      }),
    })),
  };
};
