import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircleMore, Loader2 } from "lucide-react";
import type { UserSummary } from "shared";

interface CreateChatUserItemProps {
  user: UserSummary;
  onSelect: (user: UserSummary) => void;
  isPending?: boolean;
}

export function CreateChatUserItem({
  user,
  onSelect,
  isPending = false,
}: CreateChatUserItemProps) {
  const initial = user.username?.[0]?.toUpperCase() || "U";

  return (
    <div
      onClick={() => !isPending && onSelect(user)}
      className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer hover:bg-primary/5 active:scale-[0.98] border border-transparent hover:border-primary/10"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-transparent group-hover:ring-primary/20 transition-all">
          <AvatarImage
            src={user.imageURL || undefined}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
            {initial}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-foreground truncate">
            {user.username}
          </span>
          <p className="text-xs text-muted-foreground truncate">
            Click to start chatting
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <div className="bg-primary/10 p-2 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <MessageCircleMore className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateChatUserItem;
