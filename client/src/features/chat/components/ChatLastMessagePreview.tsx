import { Badge } from "@/components/ui/badge";
import { Typing } from "@/components/Typing";
import { Image as ImageIcon } from "lucide-react";
import type { ChatLastMessage } from "shared";

interface IChatLastMessagePreviewProps {
  unreadCount?: number;
  lastMessage?: ChatLastMessage | null;
  typing?: boolean;
  isGroup: boolean;
}

export const ChatLastMessagePreview = ({
  unreadCount = 0,
  lastMessage,
  typing,
  isGroup,
}: IChatLastMessagePreviewProps) => {
  if (typing) {
    return (
      <div className="flex items-center gap-1 text-xs text-primary font-medium">
        <Typing />
      </div>
    );
  }

  if (unreadCount > 0) {
    return (
      <div className="flex items-center gap-1.5">
        <Badge variant="default" className="h-5 px-1.5 text-[10px] font-bold">
          {unreadCount}
        </Badge>
        <span className="text-xs text-primary font-medium truncate">
          new messages
        </span>
      </div>
    );
  }

  if (lastMessage) {
    const content =
      lastMessage.text || (lastMessage.hasAttachments ? "Photo" : "");

    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
        {lastMessage.hasAttachments && (
          <ImageIcon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        )}
        <span className="truncate">{content}</span>
      </div>
    );
  }

  return (
    <span className="text-xs text-muted-foreground/70 truncate">
      {isGroup ? "Group Chat" : "Direct Message"}
    </span>
  );
};
