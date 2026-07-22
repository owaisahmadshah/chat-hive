import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { correctDate } from "@/lib/correct-date";
import { cn } from "@/lib/utils";
import type { Chat } from "shared";

interface IChatItemProps {
  chat: Chat;
  activeChatId: string | null;
  handleChatClick: () => void;
}

export const ChatItem = (props: IChatItemProps) => {
  const { chat, activeChatId, handleChatClick } = props;
  const isActive = activeChatId === chat.id;

  // Fallback label generation from group name or member username
  const chatTitle = chat.name;
  const avatarUrl = chat.members[0].imageURL || "";
  const initial = chatTitle ? chatTitle[0].toUpperCase() : "C";

  return (
    <div
      onClick={handleChatClick}
      className={cn(
        "relative cursor-pointer px-4 py-3 mx-2 my-1 rounded-xl transition-all duration-300 ease-in-out",
        "group flex flex-col justify-center",
        isActive
          ? "bg-primary/10 shadow-sm"
          : "hover:bg-muted/60 active:scale-[0.98]",
        "animate-in fade-in slide-in-from-left-2 duration-500",
      )}
    >
      {isActive && (
        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
      )}

      <div className="flex items-center gap-3 relative">
        <div className="relative flex-shrink-0">
          <Avatar
            className={cn(
              "w-12 h-12 transition-transform duration-300 group-hover:scale-105",
              isActive ? "ring-2 ring-primary/30" : "ring-1 ring-border",
            )}
          >
            <AvatarImage src={avatarUrl} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <h3
              className={cn(
                "font-bold text-[14px] leading-tight truncate tracking-tight",
                isActive ? "text-primary" : "text-foreground",
              )}
            >
              {chatTitle}
            </h3>
            {chat.updatedAt && (
              <span
                className={cn(
                  "text-[11px] font-medium tabular-nums ml-auto",
                  isActive ? "text-primary/70" : "text-muted-foreground/60",
                )}
              >
                {correctDate(chat.updatedAt)}
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">
              {chat.isGroup ? "Group Chat" : "Direct Message"}
            </span>
            {!!chat.unreadCount && chat.unreadCount > 0 && (
              <span className="ml-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
