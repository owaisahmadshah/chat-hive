import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { fetchMessages } from "../services/messageService"

export const useFetchInfiniteMessages = (chatId: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: ["messages", chatId],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      fetchMessages({
        limit: 25,
        cursor: pageParam,
        chatId: chatId!,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 20 * 60 * 1000,
  })
}
