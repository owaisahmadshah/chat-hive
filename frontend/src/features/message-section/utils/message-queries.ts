export const updateQueryMessageStatus = ({
  oldData,
  messageId,
  status,
}: {
  oldData: any
  messageId: string
  status: string
}) => {
  if (!oldData) {
    return oldData
  }

  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => ({
      ...page,
      messages: page.messages.map((message: any) => {
        if (message._id !== messageId) {
          return message
        }
        return {
          ...message,
          status,
        }
      }),
    })),
  }
}

export const updateQueryMessagesStatus = ({
  oldData,
  status,
  currentUserId,
}: {
  oldData: any
  status: string
  currentUserId: string
}) => {
  if (!oldData) {
    return oldData
  }

  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => ({
      ...page,
      messages: page.messages.map((message: any) => {
        if (message.sender._id === currentUserId) {
          return { ...message, status }
        }

        return message
      }),
    })),
  }
}

export const addMessageToQuery = ({
  oldData,
  message,
}: {
  oldData: any
  message: any
}) => {
  if (!oldData) {
    return oldData
  }

  return {
    ...oldData,
    pages: oldData.pages.map((page: any, index: number) => {
      if (index !== 0) return page

      return {
        ...page,
        messages: [...page.messages, message], // prepend new messages
      }
    }),
  }
}
