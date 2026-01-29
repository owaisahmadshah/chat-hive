export const updateActiveChatUserTypingStatus = ({
  oldData,
  isTyping,
}: {
  oldData: any
  isTyping: boolean
}) => {
  if (!oldData) {
    return
  }

  return {
    ...oldData,
    isTyping: isTyping,
  }
}
