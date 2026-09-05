import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getInfiniteChatMessagesServ } from "../services/message-services";

export const useGetPaginatedMessages = (chatId: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: ["messages", chatId],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      getInfiniteChatMessagesServ({
        limit: 25,
        cursor: pageParam,
        chatId: chatId!,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 20 * 60 * 1000,
  });
};
