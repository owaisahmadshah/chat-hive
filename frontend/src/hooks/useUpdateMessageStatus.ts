import { updateMessageStatusService } from "@/services/messageGlobalService"
import { useMutation } from "@tanstack/react-query"

export const useUpdateMessageStatus = () => {
  return useMutation({
    mutationFn: updateMessageStatusService,
  })
}
