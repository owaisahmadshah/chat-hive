import { useEffect, useRef } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useFetchInfiniteMessages } from "../hooks/useFetchInfiniteMessages"
import MessageItem from "./MessageItem"
import MessageEmpty from "./MessageEmpty"
import { useDeleteMessage } from "../hooks/useDeleteMessage"

interface IMessagesListProps {
  activeChatUserId: string
  activeChatId: string
}

export const MessagesList = ({
  activeChatUserId,
  activeChatId,
}: IMessagesListProps) => {
  const { data } = useFetchInfiniteMessages(activeChatId)
  const { mutateAsync: deleteMessage } = useDeleteMessage()
  const messages = data?.pages.flatMap((page) => page.messages)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    )
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" })
    }
  }, [messages?.length])

  return (
    <ScrollArea
      className="min-h-0 h-full bg-gradient-to-b from-background to-muted/5"
      ref={scrollRef}
    >
      <div className="flex flex-col gap-3 p-4 md:px-10 lg:px-12">
        {messages?.map((message) => {
          const isMe = message.sender._id !== activeChatUserId
          return (
            <div
              key={message._id}
              className={cn(
                "flex w-full",
                isMe ? "justify-end" : "justify-start"
              )}
            >
              <MessageItem
                message={message}
                activeChatUserId={activeChatUserId}
                deleteMessage={() => deleteMessage({ messageId: message._id })}
              />
            </div>
          )
        })}
        {messages?.length === 0 && <MessageEmpty />}
      </div>
    </ScrollArea>
  )
}
