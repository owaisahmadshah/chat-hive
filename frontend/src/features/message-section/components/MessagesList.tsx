import React, { useEffect, useRef, useState } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useFetchInfiniteMessages } from "../hooks/useFetchInfiniteMessages"
import MessageItem from "./MessageItem"
import MessageEmpty from "./MessageEmpty"
import { useDeleteMessage } from "../hooks/useDeleteMessage"
import { MessageMetaDataDisplay } from "./MessageMetaDataDisplay"

interface IMessagesListProps {
  activeChatUserId: string
  activeChatId: string
}

export const MessagesList = ({
  activeChatUserId,
  activeChatId,
}: IMessagesListProps) => {
  const [isDontScroll, setisDontScroll] = useState<boolean>(false)
  const [messageMeta, setMessageMeta] = useState<Set<string>>(new Set()) // Used to show/hide message (sent, receive or seen) and date/time

  const { data } = useFetchInfiniteMessages(activeChatId)

  const { mutateAsync: deleteMessage } = useDeleteMessage()

  const messages = data?.pages.flatMap((page) => page.messages)

  const scrollRef = useRef<HTMLDivElement>(null)

  // This will make the scroll back to the bottom of the chat by targeting the viewport of radix scroll area
  const scrollToBottom = () => {
    if (isDontScroll) {
      setisDontScroll(false)
      return
    }

    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    )
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }

  useEffect(() => {
    // Add a small delay to ensure content is rendered before scrolling
    const timeoutId = setTimeout(scrollToBottom, 100)

    return () => clearTimeout(timeoutId)
  }, [data])

  const toggleMessageMeta = (id: string) => {
    setMessageMeta((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <ScrollArea
      className="min-h-0 h-full bg-gradient-to-b from-background to-muted/5"
      ref={scrollRef}
    >
      <ul className={"flex flex-col gap-2 p-4"}>
        {messages?.length &&
          messages.map((message, index) => (
            <React.Fragment key={index}>
              <li
                className={cn(
                  "rounded-2xl w-fit max-w-[75%] transition-all duration-200",
                  "animate-in fade-in slide-in-from-bottom-2",
                  message.sender._id !== activeChatUserId
                    ? "self-end bg-primary text-primary-foreground ml-auto shadow-lg shadow-primary/20"
                    : "self-start bg-muted/80 backdrop-blur-sm border border-border/40"
                )}
                style={{ animationDelay: `${index * 20}ms` }}
                onClick={() => toggleMessageMeta(message._id)}
              >
                <MessageItem
                  message={message}
                  deleteMessage={async () =>
                    await deleteMessage({ messageId: message._id })
                  }
                />
              </li>

              {(messageMeta.has(message._id) ||
                index === messages.length - 1) && (
                <MessageMetaDataDisplay
                  message={message}
                  activeChatUserId={activeChatUserId}
                />
              )}
            </React.Fragment>
          ))}

        {messages?.length === 0 && <MessageEmpty />}
      </ul>
    </ScrollArea>
  )
}
