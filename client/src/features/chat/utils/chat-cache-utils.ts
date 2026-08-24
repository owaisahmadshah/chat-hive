import type { InfiniteData } from "@tanstack/react-query";
import type { Chat, Pagination } from "shared";

export type ChatQueryData = InfiniteData<Pagination<Chat>, string | null>;

export const updateChatUnreadCount = ({
  oldData,
  chatId,
  value = 0,
  increment = false,
}: {
  oldData?: ChatQueryData;
  chatId: string;
  value?: number;
  increment?: boolean;
}): ChatQueryData | undefined => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.map((chat) => {
        if (chat.id !== chatId) return chat;

        const currentUnread = chat.unreadCount ?? 0;
        return {
          ...chat,
          unreadCount: increment ? currentUnread + value : value,
        };
      }),
    })),
  };
};

export const updateLastMessage = ({
  oldData,
  chatId,
  updatedAt = new Date(),
}: {
  oldData?: ChatQueryData;
  chatId: string;
  updatedAt?: Date;
}): ChatQueryData | undefined => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.map((chat) => {
        if (chat.id !== chatId) return chat;

        return {
          ...chat,
          updatedAt,
        };
      }),
    })),
  };
};

export const updateChatTypingStatus = ({
  oldData,
  chatId,
  typing,
}: {
  oldData?: ChatQueryData;
  chatId: string;
  typing: {
    isTyping: boolean;
    typerId: string;
  };
}): ChatQueryData | undefined => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.map((chat) => {
        if (chat.id !== chatId) return chat;

        return {
          ...chat,
          typing,
        };
      }),
    })),
  };
};

export const addChatToFeed = ({
  oldData,
  newChat,
}: {
  oldData?: ChatQueryData;
  newChat: Chat;
}): ChatQueryData => {
  if (!oldData || oldData.pages.length === 0) {
    return {
      pageParams: [null],
      pages: [
        {
          data: [newChat],
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
        return {
          ...page,
          data: [newChat, ...page.data.filter((c) => c.id !== newChat.id)],
        };
      }
      return page;
    }),
  };
};

export const removeChatById = ({
  oldData,
  chatId,
}: {
  oldData?: ChatQueryData;
  chatId: string;
}): ChatQueryData | undefined => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.filter((chat) => chat.id !== chatId),
    })),
  };
};
