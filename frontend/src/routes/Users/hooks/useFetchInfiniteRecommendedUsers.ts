import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { getRecommendedUsers } from "../services/userService"

export const useFetchInfiniteRecommendedUsers = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ["users"],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      getRecommendedUsers({ limit: 20, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
