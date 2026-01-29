import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteChatService } from "../services/chatService"
import { removeChatById } from "../utils/queries-updates"

export const useDeleteChat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteChatService,
    onSuccess: (data) => {
      queryClient.setQueryData(["chats"], (oldData: any) =>
        removeChatById({ oldData, deletedChat: data })
      )
    },
  })
}
