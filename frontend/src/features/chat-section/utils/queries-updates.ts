export const updateChatUnreadMessages = ({
  oldData,
  chatId,
  value = 0,
  increment = false,
}: {
  oldData: any
  chatId: string
  value?: number
  increment?: boolean // default to false, if true it will add
}) => {
  if (!oldData) return oldData

  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => ({
      ...page,
      chats: page.chats.map((chat: any) => {
        if (chat._id !== chatId) {
          return chat
        }

        return {
          ...chat,
          unreadMessages: increment ? chat.unreadMessages + value : value,
        }
      }),
    })),
  }
}

export const updateLastMessage = ({
  oldData,
  chatId,
  lastMessage,
}: {
  oldData: any
  chatId: string
  lastMessage: any
}) => {
  if (!oldData) return oldData

  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => ({
      ...page,
      chats: page.chats.map((chat: any) => {
        if (chat._id !== chatId) {
          return chat
        }

        return {
          ...chat,
          lastMessage,
        }
      }),
    })),
  }
}

export const updateChatTypingWithPersistantOrder = ({
  oldData,
  chatId,
  typing,
}: {
  oldData: any
  chatId: string
  typing: {
    isTyping: boolean,
    typer: any
  }
}) => {
  if (!oldData) return oldData

  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => ({
      ...page,
      chats: page.chats.map((chat: any) => {
        if (chat._id !== chatId) {
          return chat
        }

        return {
          ...chat,
          typing: {
            isTyping: typing
          },
        }
      }),
    })),
  }
}

export const addChat = ({ oldData, chat }: { oldData: any; chat: any }) => {
  if (!oldData) return oldData

  return {
    ...oldData,
    pages: oldData.pages.map((page: any, idx: number) => {
      if (idx === 0) {
        return {
          ...page,
          chats: [chat, ...page.chats],
        }
      }
      return page
    }),
  }
}
