import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircleMore, Loader2 } from "lucide-react";
import type { UserSummary } from "shared";
import { cn } from "@/lib/utils";

interface CreateChatUserItemProps {
  user: UserSummary;
  onSelect: (user: UserSummary) => void;
  isPending?: boolean;
}

export default function CreateChatUserItem({
  user,
  onSelect,
  isPending = false,
}: CreateChatUserItemProps) {
  const initial = user.username?.[0]?.toUpperCase() || "U";

  return (
    <div
      onClick={() => !isPending && onSelect(user)}
      className={cn(
        "group flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer",
        isPending
          ? "opacity-70 pointer-events-none"
          : "hover:bg-muted/60 active:bg-muted",
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="w-10 h-10 border border-border/30 shadow-sm shrink-0">
          <AvatarImage
            src={user.imageURL || undefined}
            className="object-cover"
          />
          <AvatarFallback className="bg-secondary/60 text-secondary-foreground text-sm font-medium">
            {initial}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm text-foreground truncate tracking-tight">
            {user.username}
          </span>
          <p className="text-[13px] text-muted-foreground truncate">
            @{user.username.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center pl-2 shrink-0">
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <MessageCircleMore className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground/70 transition-colors" />
        )}
      </div>
    </div>
  );
}
