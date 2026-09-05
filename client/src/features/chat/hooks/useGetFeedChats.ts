import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedChatsServ } from "../services/chat-services";
import { useUpdateChatMessagesStatus } from "@/features/messages/hooks/useUpdateChatMessagesStatus";
import { useUser } from "@/context/user-context";

export function useGetFeedChats() {
  const { state } = useUser();
  const userId = state.user?.id;
  const updateChatMessagesStatus = useUpdateChatMessagesStatus();

  // Track chat IDs whose messages have already been marked as 'delivered'
  const processedChatsRef = useRef<Set<string>>(new Set());

  const query = useInfiniteQuery({
    queryKey: ["chats"],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getFeedChatsServ({ limit: 20, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 15 * 60 * 1000,
  });

  const { data } = query;

  useEffect(() => {
    if (!data || !userId) return;

    // Collect all newly fetched chats that haven't been processed yet
    const newUnreadChats = data.pages
      .flatMap((page) => page.data)
      .filter(
        (chat) =>
          chat.unreadCount &&
          chat.unreadCount > 0 &&
          !processedChatsRef.current.has(chat.id),
      );

    if (newUnreadChats.length === 0) return;

    // Mark as delivered and add to our ref set
    newUnreadChats.forEach((chat) => {
      processedChatsRef.current.add(chat.id);

      updateChatMessagesStatus({
        chatId: chat.id,
        status: "delivered",
        userId,
      });
    });
  }, [data, userId, updateChatMessagesStatus]);

  return query;
}
