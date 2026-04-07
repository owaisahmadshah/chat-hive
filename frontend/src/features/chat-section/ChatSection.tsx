import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"

import { useDeleteChat } from "./hooks/useDeleteChat"
import { useSocketService } from "@/hooks/useSocketService"
import { useFetchInfiniteChats } from "./hooks/useFetchInfiniteChats"
import { useUpdateChatSeenMessages } from "@/hooks/useUpdateChatSeenMessages"

import { cn } from "@/lib/utils"
import Profile from "./Components/Profile"
import { ChatItem } from "./Components/ChatItem"
import CreateChat from "./Components/CreateChat"
import { ScrollArea } from "@/components/ui/scroll-area"

const ChatSection = ({
  value,
  setValue,
}: {
  value: boolean
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeChatId = searchParams.get("chatId")

  const { data } = useFetchInfiniteChats()
  const { mutateAsync: updateMessagesStatus } = useUpdateChatSeenMessages()
  const { joinSocketChat, updateReceiveAndSeenOfMessages } = useSocketService()
  const { mutateAsync: deleteChat } = useDeleteChat()

  const processedChatsRef = useRef(new Set<string>())

  const chats = data.pages.flatMap((page) => page.chats) ?? []

  useEffect(() => {
    chats.forEach((chat: any) => {
      joinSocketChat(chat._id)

      if (chat.unreadMessages && !processedChatsRef.current.has(chat._id)) {
        updateReceiveAndSeenOfMessages(chat._id, chat.unreadMessages, "receive")
        processedChatsRef.current.add(chat._id)
      }
    })
  }, [chats])

  const handleChatClick = (chat: any) => {
    if (chat.unreadMessages) {
      updateReceiveAndSeenOfMessages(chat._id, chat.unreadMessages, "seen")
      updateMessagesStatus({ chatId: chat._id, status: "seen" })
    }
    setSearchParams({ chatId: chat._id, userId: chat.user._id })
    setValue(true)
  }

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden bg-background md:min-w-[420px] w-[420px] border-r border-border/40",
        "max-sm:w-full",
        value && "max-sm:hidden",
        "transition-all duration-300"
      )}
    >
      <div className="h-[15dvh] flex justify-between items-center p-5 bg-background border-r border-border/40">
        <Profile />
        <CreateChat />
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <main className="flex flex-col">
          {chats.map((chat) => (
            <ChatItem
              key={chat._id}
              chat={chat}
              activeChatId={activeChatId}
              handleChatClick={() => handleChatClick(chat)}
              handleDeleteChat={async () =>
                await deleteChat({ chatId: chat._id })
              }
            />
          ))}
        </main>
      </ScrollArea>
    </section>
  )
}

export default ChatSection
