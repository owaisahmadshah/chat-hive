import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteChatService } from "../services/chatService"
import { removeChatById } from "../utils/queries-updates"
import { useSearchParams } from "react-router-dom"

export const useDeleteChat = () => {
  const queryClient = useQueryClient()

  const [searchParams, setSearchParams] = useSearchParams()
  const currentChatId = searchParams.get("chatId")

  return useMutation({
    mutationFn: deleteChatService,
    onSuccess: (data) => {
      queryClient.setQueryData(["chats"], (oldData: any) =>
        removeChatById({ oldData, deletedChat: data })
      )

      if (currentChatId === data._id) {
        setSearchParams({})
      }
    },
  })
}
