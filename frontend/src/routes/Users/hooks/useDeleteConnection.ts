import { useMutation } from "@tanstack/react-query"

import { deleteConnection } from "../services/userService"

export const useDeleteConnection = () => {
  return useMutation({
    mutationFn: deleteConnection,
  })
}
