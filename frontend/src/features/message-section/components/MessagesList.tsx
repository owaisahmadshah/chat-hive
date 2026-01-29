import React, { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useFetchInfiniteMessages } from "../hooks/useFetchInfiniteMessages"
import MessageItem from "./MessageItem"
import correctDate from "@/lib/correct-date"
import MessageEmpty from "./MessageEmpty"

export const MessagesList = () => {
  const [isDontScroll, setisDontScroll] = useState<boolean>(false)
  const [messageMeta, setMessageMeta] = useState<Set<string>>(new Set()) // Used to show/hide message (sent, receive or seen) and date/time

  const { data } = useFetchInfiniteMessages()

  const [searchParams] = useSearchParams()

  const userId = searchParams.get("userId")

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
      className="flex-1 min-h-0 bg-gradient-to-b from-background to-muted/5"
      ref={scrollRef}
    >
      <ul
        className={cn(
          "flex flex-col gap-2 p-4"
          // selectedChat?.typing?.isTyping && "pb-32"
        )}
      >
        {/* Load More Messages Button */}
        {/* {selectedChat && messages.length >= 30 && (
          <div className="flex justify-center mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <HoverCard openDelay={100}>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  // onClick={handleGetMoreMessages}
                  // disabled={isArrowClicked}
                  className="rounded-full h-9 px-4 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm"
                >
                  {isArrowClicked ? (
                    <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent
                className="py-2 px-3 text-xs w-auto"
                side="bottom"
              >
                Load older messages
              </HoverCardContent>
            </HoverCard>
          </div>
        )} */}
        {/* Messages */}
        {messages?.length ? (
          messages.map((message, index) => (
            <React.Fragment key={index}>
              {/* Unread Messages Divider */}
              {/* {index ===
                messages.length - (selectedChat?.unreadMessages || 0) && (
                <div className="flex items-center gap-3 my-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                    NEW MESSAGES
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </div>
              )} */}

              {/* Message Bubble */}
              <li
                className={cn(
                  "rounded-2xl w-fit max-w-[75%] transition-all duration-200",
                  "animate-in fade-in slide-in-from-bottom-2",
                  message.sender._id !== userId
                    ? "self-end bg-primary text-primary-foreground ml-auto shadow-lg shadow-primary/20"
                    : "self-start bg-muted/80 backdrop-blur-sm border border-border/40"
                )}
                style={{ animationDelay: `${index * 20}ms` }}
                onClick={() => toggleMessageMeta(message._id)}
              >
                <MessageItem message={message} />
              </li>

              {/* Message Metadata */}
              {(messageMeta.has(message._id) ||
                index === messages.length - 1) && (
                <div
                  className={cn(
                    "flex items-center direction-reverse gap-2 px-1 animate-in fade-in slide-in-from-bottom-1 duration-200",
                    message.sender._id !== userId
                      ? "self-end justify-end"
                      : "self-start justify-start"
                  )}
                >
                  <p className="text-[10px] text-muted-foreground">
                    {correctDate(message.updatedAt)}
                  </p>
                  {message.sender._id !== userId && (
                    <p
                      className={cn(
                        "text-[10px] font-medium",
                        message.status === "receive" && "text-blue-500",
                        message.status === "seen" && "text-green-500"
                      )}
                    >
                      {message.status}
                    </p>
                  )}
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <MessageEmpty />
        )}
        {/* Typing Indicator */}
        {/*{selectedChat?.typing?.isTyping && (
          <li className="self-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 bg-muted/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-border/40">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </li>
        )} */}
      </ul>
    </ScrollArea>
  )
}
