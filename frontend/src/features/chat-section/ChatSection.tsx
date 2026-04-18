import { useEffect } from "react"

import { useDeleteChat } from "./hooks/useDeleteChat"
import { useFetchInfiniteChats } from "./hooks/useFetchInfiniteChats"
import { useUpdateChatSeenMessages } from "@/hooks/useUpdateChatSeenMessages"

import { cn } from "@/lib/utils"
import Profile from "./Components/Profile"
import { ChatItem } from "./Components/ChatItem"
import CreateChat from "./Components/CreateChat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatEmitter } from "@/socket/hooks/useChatEmitter"
// import { useMessageEmitter } from "@/socket/hooks/useMessageEmitter"
import { ChatListEmpty } from "./Components/ChatListEmpty"
import { LoadMore } from "@/components/LoadMore"
import { TChat } from "shared"

interface IChatSectionProps {
  activeChatId: string | null
  activeChatUserId: string | null
  action: ({
    chatId,
    userId,
  }: {
    chatId: string | null
    userId: string | null
  }) => void
}

const ChatSection = (props: IChatSectionProps) => {
  const { activeChatId, activeChatUserId, action } = props

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useFetchInfiniteChats()
  const { mutateAsync: updateMessagesStatus } = useUpdateChatSeenMessages()
  const { joinChat } = useChatEmitter()
  // const { updateSeenStatuses } = useMessageEmitter()
  const { mutateAsync: deleteChat } = useDeleteChat()

  // const processedChatsRef = useRef(new Set<string>())

  const chats = data.pages.flatMap((page) => page.chats) ?? []

  useEffect(() => {
    chats.forEach((chat: TChat) => {
      joinChat(chat._id)

      //     if (chat.unreadMessages && !processedChatsRef.current.has(chat._id)) {
      //       updateSeenStatuses(chat._id, chat.unreadMessages, "receive")
      //       processedChatsRef.current.add(chat._id)
      // }
    })
  }, [chats])

  const handleChatClick = (chat: TChat) => {
    if (chat.unreadMessages) {
      // updateSeenStatuses(chat._id, chat.unreadMessages, "seen")
      updateMessagesStatus({ chatId: chat._id, status: "seen" })
    }
    action({ chatId: chat._id, userId: chat.user._id })
  }

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden bg-background md:min-w-[420px] w-[420px] border-r border-border/40",
        "max-sm:w-full",
        activeChatId && activeChatUserId && "max-sm:hidden",
        "transition-all duration-300"
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
                key={chat._id}
                chat={chat}
                activeChatId={activeChatId}
                handleChatClick={() => handleChatClick(chat)}
                handleDeleteChat={async () =>
                  await deleteChat({ chatId: chat._id })
                }
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
  )
}

export default ChatSection
