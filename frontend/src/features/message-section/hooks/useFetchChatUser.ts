import { useQuery } from "@tanstack/react-query"
import { fetchChatUser } from "../services/userService"
import { useSearchParams } from "react-router-dom"

export const useFetchChatUser = () => {
  const [params] = useSearchParams()

  const userId = params.get("userId")

  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchChatUser({ userId: userId! }),
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(userId),
  })
}
