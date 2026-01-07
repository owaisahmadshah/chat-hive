import { useMutation } from "@tanstack/react-query"
import { deleteMessageService } from "../services/messageService"

export const useDeleteMessage = () => {
  return useMutation({
    mutationFn: deleteMessageService,
  })
}
