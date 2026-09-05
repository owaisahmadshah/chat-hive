import { useMutation } from "@tanstack/react-query";
import { deleteMessageServ } from "../services/message-services";

export const useDeleteMessage = () => {
  return useMutation({
    mutationFn: deleteMessageServ,
    onSuccess: () => {
      // TODO: Remove from messages
    },
  });
};
