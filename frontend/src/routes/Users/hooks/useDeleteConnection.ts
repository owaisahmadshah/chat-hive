import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { deleteConnection } from "../services/userService"
import { TConnectionsPage } from "@/types/connection"

export const useDeleteConnection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteConnection,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      })

      queryClient.setQueryData<InfiniteData<TConnectionsPage>>(
        ["connections"],
        (oldData) => {
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
        }
      )
    },

    // TODO: Update in chats too
  })
}
