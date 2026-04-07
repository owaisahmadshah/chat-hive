import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { TChat } from "shared"
import { updateMessagesStatusService } from "@/services/messageGlobalService"
import { updateChatUnreadMessages } from "@/features/chat-section/utils/queries-updates"

export const useUpdateChatSeenMessages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMessagesStatusService,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["chats"],
        (
          oldData:
            | InfiniteData<{ chats: TChat[]; nextCursor: string | null }>
            | undefined
        ) => updateChatUnreadMessages({ oldData, chatId: variables.chatId })
      )
    },
  })
}
