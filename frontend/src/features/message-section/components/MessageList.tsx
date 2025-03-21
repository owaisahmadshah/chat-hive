import { useSelector } from "react-redux"
import { useEffect, useRef } from "react";

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
          messages.length ?
            messages.map((message: Message) => (
              <li key={message._id}
                className={`
                box-border border rounded-[10px] w-fit max-w-[60vw] 
                ${message.sender._id === user.userId
                    ? "self-end bg-background"
                    : "self-start bg-primary"}
              `}
              >
                <MessageItem message={message} />
              </li>
            ))
            :
            <div className="flex justify-center bg-background text-foreground mb-[35vh]">
              <p className="text-lg font-medium text-muted-foreground">You don't have any messages...</p>
            </div>
        }
      </ul>
    </ScrollArea>
  )
}

export default MessageList
