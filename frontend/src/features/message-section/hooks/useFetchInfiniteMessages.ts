import { useInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

import { fetchMessages } from "../services/messageService"

export const useFetchInfiniteMessages = () => {
  const [searchParams] = useSearchParams()

  const chatId = searchParams.get("chatId")

  return useInfiniteQuery({
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
    enabled: Boolean(chatId),
  })
}
