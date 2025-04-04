import { useSelector } from "react-redux"
import React, { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area"
import { RootState } from "@/store/store"
import { Message } from "@/features/message-section/types/message-interface"
import MessageItem from "./MessageItem";

const MessageList = () => {

  const { selectedChat } = useSelector((state: RootState) => state.chats)
  const allMessages = useSelector((state: RootState) => state.messages)
  const user = useSelector((state: RootState) => state.user)

  const messages: Message[] = allMessages[selectedChat?._id || ""]
  const scrollRef = useRef<HTMLDivElement>(null)

  // This will make the scroll back to the bottom of the chat by targeting the viewport of radix scroll area
  const scrollToBottom = () => {
    const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }

  useEffect(() => {
    // Add a small delay to ensure content is rendered before scrolling
    const timeoutId = setTimeout(scrollToBottom, 100)

    return () => clearTimeout(timeoutId)
  }, [messages])


  return (
    <ScrollArea
      className="box-border border-r border-l h-[75vh] pb-3"
      ref={scrollRef}>
      <ul className="flex flex-col gap-1 p-2 px-15 h-[75vh]">
        {
          selectedChat && messages.length ?
            messages.map((message: Message, index) => (
              <React.Fragment key={message._id}>
                {index === (messages.length - (selectedChat?.unreadMessages)) &&
                  <span
                    className="mx-auto my-3 px-3 py-1 text-xs font-medium rounded-full bg-background shadow-lg shadow-muted-foreground"
                  >UNREAD MESSAGES </span>}
                <li className={`
                box-border border rounded-[10px] w-fit max-w-[60vw] 
                ${message.sender._id === user.userId
                    ? "self-end bg-background"
                    : "self-start bg-primary"}
              `}
                >
                  <MessageItem message={message} />
                </li>
              </React.Fragment>
            ))
            :
            <div className="flex flex-col items-center justify-center h-full text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12 text-muted-foreground mb-2"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-2.4.33A8.5 8.5 0 1 1 9.5 3a8.38 8.38 0 0 1 .33 2.4M3 21l5.5-5.5" />
              </svg>
              <p className="text-lg font-medium text-muted-foreground">
                You don’t have any messages...
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start a conversation now!
              </p>
            </div>
        }
      </ul>
    </ScrollArea>
  )
}

export default MessageList
