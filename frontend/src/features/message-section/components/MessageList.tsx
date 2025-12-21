import { useSelector } from "react-redux"
import React, { useEffect, useRef, useState } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { RootState } from "@/store/store"
import { Message } from "shared"
import MessageItem from "./MessageItem"
import { useSocketService } from "@/hooks/useSocketService"
import correctDate from "@/lib/correct-date"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMessage } from "../hooks/useMessage"
import { ArrowUp } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import MessageEmpty from "./MessageEmpty"

const MessageList = () => {
  const [isDontScroll, setisDontScroll] = useState<boolean>(false)
  const [isArrowClicked, setIsArrowClicked] = useState<boolean>(false)
  const [messageMeta, setMessageMeta] = useState<Set<string>>(new Set()) // Used to show/hide message (sent, receive or seen) and date/time

  const { updateReceiveAndSeenOfMessages } = useSocketService()
  const { getChatMessages } = useMessage()

  const { selectedChat } = useSelector((state: RootState) => state.chats)
  const allMessages = useSelector((state: RootState) => state.messages)
  const user = useSelector((state: RootState) => state.user)

  const messages: Message[] = allMessages[selectedChat?._id || ""]
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
  }, [messages])

  // TODO: Add code to the right place
  // If we have selected a chat and we are on another tab
  // we will receive message but they are not seen and when we
  // reclick the tab we will seen the messages
  useEffect(() => {
    if (selectedChat?.unreadMessages) {
      updateReceiveAndSeenOfMessages(
        user.userId,
        selectedChat._id,
        selectedChat.unreadMessages,
        "seen"
      )
    }
  }, [document.visibilityState])

  const handleGetMoreMessages = async () => {
    if (!selectedChat?._id) {
      return
    }
    setIsArrowClicked(true)
    setisDontScroll(true)
    await getChatMessages(selectedChat?._id)
    setIsArrowClicked(false)
  }

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
      className="flex-1 max-h-[calc(96vh-8rem)] bg-gradient-to-b from-background to-muted/5"
      ref={scrollRef}
    >
      <ul
        className={cn(
          "flex flex-col gap-2 p-4",
          selectedChat?.typing?.isTyping && "pb-32"
        )}
      >
        {/* Load More Messages Button */}
        {selectedChat && messages.length >= 30 && (
          <div className="flex justify-center mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <HoverCard openDelay={100}>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetMoreMessages}
                  disabled={isArrowClicked}
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
        )}

        {/* Messages */}
        {selectedChat && messages.length ? (
          messages.map((message: Message, index) => (
            <React.Fragment key={message._id}>
              {/* Unread Messages Divider */}
              {index ===
                messages.length - (selectedChat?.unreadMessages || 0) && (
                <div className="flex items-center gap-3 my-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                    NEW MESSAGES
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </div>
              )}

              {/* Message Bubble */}
              <li
                className={cn(
                  "rounded-2xl w-fit max-w-[75%] transition-all duration-200",
                  "animate-in fade-in slide-in-from-bottom-2",
                  message.sender._id === user.userId
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
                    "flex items-center gap-2 px-1 animate-in fade-in slide-in-from-bottom-1 duration-200",
                    message.sender._id === user.userId
                      ? "self-end justify-end"
                      : "self-start justify-start"
                  )}
                >
                  <p className="text-[10px] text-muted-foreground">
                    {correctDate(message.updatedAt)}
                  </p>
                  {message.sender._id === user.userId && (
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
        {selectedChat?.typing?.isTyping && (
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
        )}
      </ul>
    </ScrollArea>
  )
}

export default MessageList
