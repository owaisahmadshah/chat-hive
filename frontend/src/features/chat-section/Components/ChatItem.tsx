import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import correctDate from "@/lib/correct-date"
import { cn } from "@/lib/utils"
import { ChatLastMessagePreview } from "./ChatLastMessagePreview"

interface IChatItemProps {
  chat: any
  activeChatId: string | null
  handleChatClick: () => void
  handleDeleteChat: () => Promise<unknown>
}

export const ChatItem = (props: IChatItemProps) => {
  const { chat, activeChatId, handleChatClick, handleDeleteChat } = props

  return (
    <div
      key={chat._id}
      onClick={handleChatClick}
      className={cn(
        "cursor-pointer px-4 py-3 transition-all duration-200",
        "hover:bg-muted/50 relative group",
        "border-l-2",
        activeChatId === chat._id
          ? "bg-primary/5 border-l-primary"
          : "border-l-transparent hover:border-l-primary/30",
        "animate-in fade-in slide-in-from-left-2"
      )}
    >
      <div className="flex items-center gap-3 relative">
        {/* Avatar with online status */}
        <div className="relative">
          <Avatar
            className={cn(
              "w-12 h-12 ring-2 transition-all",
              activeChatId === chat._id
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

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p
              className={cn(
                "font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap",
                activeChatId === chat._id && "text-primary"
              )}
            >
              {chat.user.username}
            </p>
            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
              {correctDate(chat.updatedAt)}
            </span>
          </div>

          {/* Last Message Preview */}
          <ChatLastMessagePreview
            lastMessage={chat.lastMessage}
            unreadMessages={chat.unreadMessages}
            deleteAction={handleDeleteChat}
            typing={chat.isTyping ? { isTyping: true } : undefined}
          />
        </div>
      </div>
    </div>
  )
}
