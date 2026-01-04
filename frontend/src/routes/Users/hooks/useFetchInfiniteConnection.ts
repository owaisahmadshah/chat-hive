import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { getConnections } from "../services/userService"

export const useFetchInfiniteConnection = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ["connections"],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      getConnections({ limit: 20, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
