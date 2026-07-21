import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedChatsServ } from "../services/chat-services";

export function useGetFeedChats() {
  return useInfiniteQuery({
    queryKey: ["chats"],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getFeedChatsServ({ limit: 20, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 15 * 60 * 1000,
  });
}
