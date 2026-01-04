import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createConnection } from "../services/userService"

export const useCreateConnection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createConnection,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["connections"],
      })

      queryClient.setQueryData(["users"], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            users: page.users.filter((user) => user._id !== data.receiver._id),
          })),
        }
      })
    },

    // TODO: Update in chats too
  })
}
