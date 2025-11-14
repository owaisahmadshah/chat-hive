import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Chat } from "@/types/chat-interface"
import { ChatUser } from "shared"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  setSelectedChat,
  setSelectedChatUser,
  updateChatWithPersistentOrder,
} from "@/store/slices/chats"
import correctDate from "@/lib/correct-date"
import ChatActions from "./ChatActions"
import NoChats from "./NoChats"
import { Image, Circle } from "lucide-react"
import useMessageGlobalHook from "@/hooks/useMessageGlobalHook"
import { useSocketService } from "@/hooks/useSocketService"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const Chats = ({
  setValue,
}: {
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const dispatch = useDispatch()
  const chats = useSelector((state: RootState) => state.chats)
  const userId = useSelector((state: RootState) => state.user.userId)

  const { updateMessagesStatus } = useMessageGlobalHook()
  const { updateReceiveAndSeenOfMessages } = useSocketService()

  const handleClickedChat = async (selectedChat: Chat) => {
    setValue(true)

    if (selectedChat.unreadMessages) {
      dispatch(
        updateChatWithPersistentOrder({
          chatId: selectedChat._id,
          updates: { unreadMessages: 0 },
        })
      )
    }

    if (
      selectedChat._id !== chats.selectedChat?._id &&
      selectedChat.unreadMessages > 0
    ) {
      let hasUnreadMessages = false
      let unreadMessages = 0
      for (let i = 0; i < chats.chats.length; i++) {
        if (chats.chats[i]._id === selectedChat._id) {
          if (chats.chats[i].unreadMessages > 0) {
            hasUnreadMessages = true
            unreadMessages = chats.chats[i].unreadMessages
          }
          break
        }
      }

      if (hasUnreadMessages) {
        await updateMessagesStatus(selectedChat._id, "seen")
        updateReceiveAndSeenOfMessages(
          userId,
          selectedChat._id,
          unreadMessages,
          "seen"
        )
      }
    }

    dispatch(setSelectedChat(selectedChat))

    if (selectedChat.users.length === 1) {
      dispatch(setSelectedChatUser(selectedChat.users[0]))
      return
    }

    for (let i = 0; i < selectedChat.users.length; i++) {
      if (selectedChat.users[i]._id !== userId) {
        dispatch(setSelectedChatUser(selectedChat.users[i]))
        break
      }
    }
  }

  function getChatUserName(chatUsersList: ChatUser[]) {
    if (chatUsersList.length === 1) {
      return chatUsersList[0].username
    }
    let username = ""
    for (let i = 0; i < chatUsersList.length; i++) {
      if (chatUsersList[i]._id !== userId) {
        username = chatUsersList[i].username
        break
      }
    }
    return username
  }

  function getChatUser(chatUsersList: ChatUser[]) {
    if (chatUsersList.length === 1) {
      return chatUsersList[0]
    }
    for (let i = 0; i < chatUsersList.length; i++) {
      if (chatUsersList[i]._id !== userId) {
        return chatUsersList[i]
      }
    }
    return chatUsersList[0]
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <ul className="flex flex-col">
        {chats.chats.length === 0 && <NoChats />}
        {!chats.isLoading &&
          chats.chats.length > 0 &&
          chats.chats.map((chat: Chat, index) => {
            const chatUser = getChatUser(chat.users)
            const isSelected = chats.selectedChat?._id === chat._id

            return (
              <li
                key={index}
                onClick={() => handleClickedChat(chat)}
                className={cn(
                  "cursor-pointer px-4 py-3 transition-all duration-200",
                  "hover:bg-muted/50 relative group",
                  "border-l-2",
                  isSelected
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
                        isSelected
                          ? "ring-primary/20"
                          : "ring-transparent group-hover:ring-primary/10"
                      )}
                    >
                      <AvatarImage
                        src={
                          chat.users.length === 1
                            ? chat.users[0].imageUrl
                            : chat.users[0]._id === userId
                            ? chat.users[1].imageUrl
                            : chat.users[0].imageUrl
                        }
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getChatUserName(chat.users).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chatUser?.isUserOnline && (
                      <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500 ring-2 ring-background" />
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p
                        className={cn(
                          "font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap",
                          isSelected && "text-primary"
                        )}
                      >
                        {getChatUserName(chat.users)}
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
            )
          })}
      </ul>
    </ScrollArea>
  )
}

export default Chats
