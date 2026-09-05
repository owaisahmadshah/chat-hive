import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LoadMore } from "@/components/LoadMore";
import { useGetPaginatedMessages } from "../hooks/useGetPaginatedMessages";
import { useDeleteMessage } from "../hooks/useDeleteMessage";
import type { Message } from "shared";
import MessageItem from "./MessageItem";
import MessageEmpty from "./MessageEmpty";

interface IMessagesListProps {
  activeChatId: string;
  currentUserId?: string;
}

export const MessagesList = ({
  activeChatId,
  currentUserId,
}: IMessagesListProps) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetPaginatedMessages(activeChatId);
  const { mutateAsync: deleteMessage } = useDeleteMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages: Message[] =
    data?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.data) ?? [];

  const pageCount = data?.pages.length ?? 0;
  const prevPageCountRef = useRef(pageCount);
  const scrollSnapRef = useRef<{
    scrollHeight: number;
    scrollTop: number;
  } | null>(null);

  const getViewport = () =>
    scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement | null;

  const handleLoadMore = () => {
    const viewport = getViewport();
    if (viewport) {
      scrollSnapRef.current = {
        scrollHeight: viewport.scrollHeight,
        scrollTop: viewport.scrollTop,
      };
    }
    fetchNextPage();
  };

  useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;

    const isLoadingMore =
      pageCount > prevPageCountRef.current && scrollSnapRef.current !== null;

    if (isLoadingMore) {
      const { scrollHeight: oldScrollHeight, scrollTop: oldScrollTop } =
        scrollSnapRef.current!;
      const scrollDiff = viewport.scrollHeight - oldScrollHeight;
      viewport.scrollTo({ top: oldScrollTop + scrollDiff });
      scrollSnapRef.current = null;
    } else {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    }

    prevPageCountRef.current = pageCount;
  }, [messages.length, pageCount]);

  return (
    <ScrollArea
      className="min-h-0 h-full bg-gradient-to-b from-background to-muted/5"
      ref={scrollRef}
    >
      <div className="flex flex-col gap-3 p-4 md:px-10 lg:px-12">
        <LoadMore
          onLoad={handleLoadMore}
          isPending={isFetchingNextPage}
          hasNextPage={!!hasNextPage}
          label="View previous messages"
        />

        {messages.map((message) => {
          const isMe = message.sender.id === currentUserId;
          return (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                isMe ? "justify-end" : "justify-start",
              )}
            >
              <MessageItem
                message={message}
                currentUserId={currentUserId}
                deleteMessage={async () => {
                  await deleteMessage(message.id);
                }}
              />
            </div>
          );
        })}
        {messages.length === 0 && <MessageEmpty />}
      </div>
    </ScrollArea>
  );
};
