import { useSearchParams } from "react-router-dom"
import { Image } from "lucide-react"
import { useSelector } from "react-redux"
import { useQueryClient } from "@tanstack/react-query"

import { useFetchInfiniteChats } from "../hooks/useFetchInfiniteChats"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import ChatActions from "./ChatActions"

import correctDate from "@/lib/correct-date"
import { cn } from "@/lib/utils"

import { useSocketService } from "@/hooks/useSocketService"

import { RootState } from "@/store/store"
import { updateChatUnreadMessages } from "../utils/queries-updates"

export const ChatsList = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const userId = useSelector((state: RootState) => state.user.userId)

  const { updateReceiveAndSeenOfMessages } = useSocketService()

  const { data } = useFetchInfiniteChats()

  const chats = data.pages.flatMap((page) => page.chats) ?? []

  const currentChatId = searchParams.get("chatId")

  const queryClient = useQueryClient()

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <ul className="flex flex-col">
        {chats.map((chat, index) => (
          <li
            key={chat._id}
            onClick={() => {
              setSearchParams({ chatId: chat._id, userId: chat.user._id })
              if (chat.unreadMessages) {
                updateReceiveAndSeenOfMessages(
                  userId,
                  chat._id,
                  chat.unreadMessages,
                  "seen"
                )
                queryClient.setQueryData(["chats"], (oldData: any) =>
                  updateChatUnreadMessages({ oldData, chatId: chat._id })
                )
                // TODO: Update in the backend too...
              }
            }}
            className={cn(
              "cursor-pointer px-4 py-3 transition-all duration-200",
              "hover:bg-muted/50 relative group",
              "border-l-2",
              currentChatId === chat._id
                ? "bg-primary/5 border-l-primary"
                : "border-l-transparent hover:border-l-primary/30",
              "animate-in fade-in slide-in-from-left-2"
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-center gap-3 relative">
              {/* Avatar with online status */}
              <div className="relative">
                <Avatar
                  className={cn(
                    "w-12 h-12 ring-2 transition-all",
                    currentChatId === chat._id
                      ? "ring-primary/20"
                      : "ring-transparent group-hover:ring-primary/10"
                  )}
                >
                  <AvatarImage src={chat.user.imageUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {`${chat.user.username[0].toUpperCase()}`}
                  </AvatarFallback>
                </Avatar>
                {/* {chatUser?.isUserOnline && (
                  <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500 ring-2 ring-background" />
                )} */}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className={cn(
                      "font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap",
                      currentChatId === chat._id && "text-primary"
                    )}
                  >
                    {chat.user.username}
                  </p>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {correctDate(chat.updatedAt)}
                  </span>
                </div>

                {/* Last Message Preview */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0 w-6">
                    {chat?.typing?.isTyping ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-primary font-medium">
                          typing
                        </span>
                        <div className="flex gap-0.5">
                          <span
                            className="w-1 h-1 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-1 h-1 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-1 h-1 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    ) : chat.unreadMessages > 0 ? (
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="default"
                          className="h-5 px-2 text-xs font-semibold"
                        >
                          {chat.unreadMessages}
                        </Badge>
                        <span className="text-xs text-primary font-medium">
                          new messages
                        </span>
                      </div>
                    ) : chat.lastMessage.isPhoto ? (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Image className="w-3.5 h-3.5" />
                        <span className="text-xs">Photo</span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                        {chat.lastMessage.message}
                      </p>
                    )}
                  </div>

                  {/* Chat Actions (visible on hover) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChatActions chat={chat} />
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
