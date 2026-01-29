import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateMessagesStatusService } from "@/services/messageGlobalService"
import { updateChatUnreadMessages } from "@/features/chat-section/utils/queries-updates"

export const useUpdateChatSeenMessages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMessagesStatusService,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["chats"], (oldData: any) =>
        updateChatUnreadMessages({ oldData, chatId: variables.chatId })
      )
    },
  })
}
