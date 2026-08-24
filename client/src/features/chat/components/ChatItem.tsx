import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";

import { correctDate } from "@/lib/correct-date";
import { cn } from "@/lib/utils";
import { ChatLastMessagePreview } from "./ChatLastMessagePreview";
import type { Chat } from "shared";

interface IChatItemProps {
  chat: Chat;
  currentUserId?: string;
  activeChatId: string | null;
  handleChatClick: () => void;
  handleDeleteChat: (
    chatId: string,
  ) => Promise<{ chatId: string; message: string }>;
}

export const ChatItem = ({
  chat,
  currentUserId,
  activeChatId,
  handleChatClick,
  handleDeleteChat,
}: IChatItemProps) => {
  const isActive = activeChatId === chat.id;

  // Resolve chat metadata (Direct Message vs Group Chat)
  const otherMember = chat.members.find(
    (member) => member.id !== currentUserId && member.userId !== currentUserId,
  );

  const chatTitle = chat.name ?? (otherMember?.username as string);

  const avatarUrl = otherMember?.imageURL || "avatar-url";

  const initial = chatTitle[0]?.toUpperCase() || "C";

  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handleDeleteChat) {
      await handleDeleteChat(chat.id);
    }
  };

  return (
    <div
      onClick={handleChatClick}
      className={cn(
        "relative cursor-pointer px-4 py-3 mx-2 my-1 rounded-xl transition-all duration-300 ease-in-out",
        "group flex items-center justify-between gap-3",
        isActive
          ? "bg-primary/10 shadow-sm"
          : "hover:bg-muted/60 active:scale-[0.98]",
        "animate-in fade-in slide-in-from-left-2 duration-500",
      )}
    >
      {isActive && (
        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
      )}

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
                "text-[11px] font-medium tabular-nums flex-shrink-0",
                isActive ? "text-primary/70" : "text-muted-foreground/60",
              )}
            >
              {correctDate(chat.updatedAt)}
            </span>
          )}
        </div>

        <div className="relative flex items-center justify-between">
          <ChatLastMessagePreview
            unreadCount={chat.unreadCount}
            lastMessage={chat.lastMessage}
            typing={chat.typing}
            isGroup={chat.isGroup}
          />
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 max-sm:opacity-100 transition-opacity flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Chat options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Chat</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
