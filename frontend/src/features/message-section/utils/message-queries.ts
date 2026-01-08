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
