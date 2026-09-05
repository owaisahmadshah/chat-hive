import { cn } from "@/lib/utils";
import { Profile } from "./components/Profile";
import { ChatItem } from "./components/ChatItem";
import { CreateChat } from "./components/CreateChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListEmpty } from "./components/ChatListEmpty";
import { LoadMore } from "@/components/LoadMore";
import { useGetFeedChats } from "./hooks/useGetFeedChats";
import type { Chat } from "shared";
import { useDeleteChat } from "./hooks/useDeleteChat";
import { useUpdateChatMessagesStatus } from "../messages/hooks/useUpdateChatMessagesStatus";
import { useUser } from "@/context/user-context";

interface IChatSectionProps {
  activeChatId: string | null;
  activeChatUserId: string | null;
  action: ({
    chatId,
    userId,
  }: {
    chatId: string | null;
    userId: string | null;
  }) => void;
}

export const ChatSection = (props: IChatSectionProps) => {
  const { activeChatId, activeChatUserId, action } = props;

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetFeedChats();

  const { state } = useUser();
  const userId = state.user?.id ?? "";

  const updateChatMessagesStatus = useUpdateChatMessagesStatus();

  const chats: Chat[] = data?.pages.flatMap((page) => page.data) ?? [];

  const { mutateAsync: deleteChatById } = useDeleteChat();

  const handleChatClick = async (chat: Chat) => {
    // Finds first member that isn't the logged-in user if needed
    const otherMemberId = chat.members.filter(
      (memb) => memb.userId !== userId,
    )[0].userId;
    action({ chatId: chat.id, userId: otherMemberId });

    await updateChatMessagesStatus({
      chatId: chat.id,
      status: "read",
      userId,
    });
  };

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden bg-background md:min-w-[420px] w-[420px] border-r border-border/40",
        "max-sm:w-full",
        activeChatId && activeChatUserId && "max-sm:hidden",
        "transition-all duration-300",
      )}
    >
      <div className="h-[15dvh] flex justify-between items-center p-5 bg-background border-r border-border/40">
        <Profile />
        <CreateChat />
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <main className="flex flex-col">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                activeChatId={activeChatId}
                handleChatClick={() => handleChatClick(chat)}
                handleDeleteChat={(chatId) => deleteChatById({ chatId })}
              />
            ))
          ) : (
            <ChatListEmpty />
          )}

          <LoadMore
            onLoad={fetchNextPage}
            isPending={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            label="Load more chats"
            direction="down"
          />
        </main>
      </ScrollArea>
    </section>
  );
};
