import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteConnection } from "../services/userService"

export const useDeleteConnection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteConnection,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      })

      console.log(data)

      queryClient.setQueryData(["connections"], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            connections: page.connections.filter(
              (connection) => connection._id !== data._id
            ),
          })),
        }
      })
    },

    // TODO: Update in chats too
  })
}
