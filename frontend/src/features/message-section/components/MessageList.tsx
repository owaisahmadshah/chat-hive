import { useSelector } from "react-redux"
import React, { useEffect, useRef, useState } from "react"
// import { CircleLoader, SyncLoader } from "react-spinners"
import { CircleLoader } from "react-spinners"

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


  // TODO: Add code to the right place
  // If we have selected a chat and we are on another tab
  // we will receive message but they are not seen and when we
  // reclick the tab we will seen the messages 
  useEffect(() => {
    if (selectedChat?.unreadMessages) {
      updateReceiveAndSeenOfMessages(user.userId, selectedChat._id, selectedChat.unreadMessages, "seen")
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
    setMessageMeta(prev => {
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
      className="box-border border-r h-[75vh]"
      ref={scrollRef}>
      <ul className={cn(
        "flex flex-col gap-1 p-2 px-15 h-[75vh]",
        selectedChat?.typing?.isTyping && "mb-[155px]"
      )}>
        {/* Must be >= 30 to load older messages; less means no more messages to fetch. */}
        {selectedChat && messages.length >= 30 &&
          <div className="mx-auto">
            <HoverCard>
              <HoverCardTrigger>
                <Button variant={"outline"}
                  onClick={handleGetMoreMessages}
                  className="text-xs rounded-full cursor-pointer">
                  {
                    isArrowClicked ? <CircleLoader color="#C0C0C0" size={10} />
                      : <ArrowUp />
                  }
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="py-1 px-4 w-40">
                Older messages...
              </HoverCardContent>
            </HoverCard>
          </div>
        }
        {
          selectedChat && messages.length ?
            messages.map((message: Message, index) => (
              <React.Fragment key={message._id}>
                {index === (messages.length - (selectedChat?.unreadMessages)) &&
                  <span
                    className="mx-auto my-3 px-3 py-1 text-xs font-medium rounded-full bg-background shadow-md shadow-muted-foreground"
                  >UNREAD MESSAGES </span>}
                <li className={cn(
                  "box-border border rounded-[10px] w-fit max-w-[60vw] self-start bg-primary",
                  message.sender._id === user.userId &&
                  "self-end bg-background flex items-center"
                )}
                  onClick={() => toggleMessageMeta(message._id)}
                >
                  <MessageItem message={message} />
                </li>
                {(messageMeta.has(message._id) || index === messages.length - 1) &&
                  <div
                    className={cn(
                      message.sender._id === user.userId
                        ? "self-end flex items-center justify-between w-[80px]"
                        : "self-start"
                    )}
                  >
                    <p className={`text-[10px] text-muted-foreground`}>{correctDate(message.updatedAt)}</p>
                    <p className="text-[10px]">{message.sender._id === user.userId && message.status}</p>
                  </div>
                }
              </React.Fragment>
            ))
            :
            <MessageEmpty />
        }
        {/* {
          selectedChat?.typing?.isTyping &&
          <li className="h-[50px] sticky bottom-0">
            <SyncLoader color="#C0C0C0" size={10} />
          </li>
        } */}
      </ul>
    </ScrollArea >
  )
}

export default MessageList
