import { useMutation } from "@tanstack/react-query"
import { deleteChatService } from "../services/chatService"

export const useDeleteChat = () => {
  return useMutation({
    mutationFn: deleteChatService,
    onSuccess: (data) => {
      console.log(data)
    },
  })
}
