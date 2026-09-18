import { useLayoutEffect, useRef } from "react";
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

  const messages: Message[] = data?.pages.flatMap((page) => page.data) ?? [];

  const prevChatIdRef = useRef(activeChatId);
  const isLoadingOlderRef = useRef(false);
  const initialLoadDoneRef = useRef(false);
  const scrollSnapRef = useRef<{
    scrollHeight: number;
    scrollTop: number;
  } | null>(null);

  const getViewport = () =>
    scrollRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement | null;

  const handleLoadMore = () => {
    const viewport = getViewport();
    if (viewport) {
      scrollSnapRef.current = {
        scrollHeight: viewport.scrollHeight,
        scrollTop: viewport.scrollTop,
      };
    }
    isLoadingOlderRef.current = true;
    fetchNextPage();
  };

  useLayoutEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;

    if (prevChatIdRef.current !== activeChatId) {
      prevChatIdRef.current = activeChatId;
      initialLoadDoneRef.current = false;
      isLoadingOlderRef.current = false;
      scrollSnapRef.current = null;
    }

    if (isLoadingOlderRef.current && scrollSnapRef.current) {
      const { scrollHeight: oldScrollHeight, scrollTop: oldScrollTop } =
        scrollSnapRef.current;
      const scrollDiff = viewport.scrollHeight - oldScrollHeight;
      viewport.scrollTo({ top: oldScrollTop + scrollDiff });
      isLoadingOlderRef.current = false;
      scrollSnapRef.current = null;
      return;
    }

    if (messages.length === 0) return;

    if (!initialLoadDoneRef.current) {
      initialLoadDoneRef.current = true;
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "instant" });
      return;
    }

    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [messages.length, activeChatId]);

  return (
    <ScrollArea
      className="min-h-0 h-full bg-gradient-to-b from-background to-muted/5"
      ref={scrollRef}
    >
      <div className="flex flex-col-reverse gap-3 p-4 md:px-10 lg:px-12">
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
                  await deleteMessage({
                    messageId: message.id,
                    chatId: activeChatId,
                  });
                }}
              />
            </div>
          );
        })}

        <LoadMore
          onLoad={handleLoadMore}
          isPending={isFetchingNextPage}
          hasNextPage={!!hasNextPage}
          label="View previous messages"
        />

        {messages.length === 0 && <MessageEmpty />}
      </div>
    </ScrollArea>
  );
};
