import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { correctDate } from "@/lib/correct-date";

interface IChatUserNavbarCardProps {
  user: {
    id: string;
    username: string;
    imageURL?: string | null;
    lastSeen?: Date | string | null;
  };
  backAction?: () => void;
}

export const ChatUserNavbarCard = ({
  user,
  backAction,
}: IChatUserNavbarCardProps) => {
  const initial = user?.username?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex items-center gap-1 md:gap-3 h-full max-w-full">
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden h-10 w-8 px-0 hover:bg-transparent"
        onClick={(e) => {
          e.stopPropagation();
          backAction?.();
        }}
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </Button>

      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar className="w-10 h-10 border border-border/50 shrink-0">
          <AvatarImage
            src={user?.imageURL || undefined}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {initial}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col truncate">
          <strong className="text-[15px] font-bold leading-tight truncate">
            {user?.username || "Chat Member"}
          </strong>
          <p className="text-[12px] leading-tight">
            {user?.lastSeen ? (
              <span className="text-muted-foreground">
                last seen {correctDate(user.lastSeen)}
              </span>
            ) : (
              <span className="text-muted-foreground">offline</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
