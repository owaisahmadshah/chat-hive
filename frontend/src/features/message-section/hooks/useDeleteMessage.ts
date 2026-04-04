import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteMessageService } from "../services/messageService"
import { TDeletedMessageResponse } from "shared"
import { deleteMessageFromQuery } from "../utils/message-queries"

export const useDeleteMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMessageService,
    onSuccess: (response: {
      statusCode: number
      data: TDeletedMessageResponse
      message: string
    }) => {
      const data = response.data

      queryClient.setQueryData(
        ["messages", data.chatId.toString()],
        (oldData: any) =>
          deleteMessageFromQuery({
            oldData,
            messageId: data.messageId,
          })
      )
    },
  })
}
