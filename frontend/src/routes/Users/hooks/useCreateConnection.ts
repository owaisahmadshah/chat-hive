import { useMutation } from "@tanstack/react-query"

import { createConnection } from "../services/userService"

export const useCreateConnection = () => {
  return useMutation({
    mutationFn: createConnection,
  })
}
