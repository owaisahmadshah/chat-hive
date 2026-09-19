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
  const avatarUrl = chat.logoURL || otherMember?.imageURL || "avatar-url";
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
        "group relative flex items-center justify-between gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-xl transition-colors cursor-pointer",
        isActive ? "bg-muted" : "hover:bg-muted/50",
      )}
    >
      <Avatar className="w-11 h-11 border border-border/40 shadow-sm shrink-0">
        <AvatarImage src={avatarUrl} className="object-cover" />
        <AvatarFallback className="bg-secondary/60 text-secondary-foreground font-medium text-sm">
          {initial}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h3 className="font-medium text-sm leading-tight truncate tracking-tight text-foreground">
            {chatTitle}
          </h3>

          {chat.updatedAt && (
            <span
              className={cn(
                "text-[11px] font-medium flex-shrink-0",
                isActive ? "text-foreground/70" : "text-muted-foreground/80",
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
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-full"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Chat options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded-xl shadow-lg border-border/40 p-1 bg-background/95 backdrop-blur-md"
          >
            <DropdownMenuItem
              onClick={onDelete}
              className="gap-2.5 cursor-pointer py-2 px-2.5 rounded-lg text-destructive/90 focus:text-destructive focus:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm font-medium">Delete chat</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
