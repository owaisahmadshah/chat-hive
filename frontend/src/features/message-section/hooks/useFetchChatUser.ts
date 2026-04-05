import { useSuspenseQuery } from "@tanstack/react-query"
import { fetchChatUser } from "../services/userService"

export const useFetchChatUser = (userId: string) => {
  return useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchChatUser({ userId: userId! }),
    staleTime: 10 * 60 * 1000,
  })
}
