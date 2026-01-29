import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import { createChat } from "../services/chatService"
import { addChat } from "../utils/queries-updates"

export const useCreateChat = () => {
  const queryClient = useQueryClient()
  const [, setSearchParams] = useSearchParams()

  return useMutation({
    mutationFn: createChat,
    onSuccess: (data) => {
      queryClient.setQueryData(["chats"], (oldData: any) =>
        addChat({ oldData, chat: data })
      )

      setSearchParams({ chatId: data._id, userId: data.user._id })
    },
  })
}
