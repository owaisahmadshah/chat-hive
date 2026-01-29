import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { fetchUserChats } from "../services/chatService"

export const useFetchInfiniteChats = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ["chats"],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      fetchUserChats({ limit: 20, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 15 * 60 * 1000,
  })
}
