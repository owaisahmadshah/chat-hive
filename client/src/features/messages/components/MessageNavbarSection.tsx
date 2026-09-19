import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChatUserNavbarCard } from "./ChatUserNavbarCard";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useGetChatUser } from "@/hooks/useGetChatUser";

interface IMessageNavbarSectionProps {
  backAction: () => void;
  activeChatUserId: string;
  deleteChat: () => Promise<void>;
}

export const MessageNavbarSection = ({
  backAction,
  activeChatUserId,
  deleteChat,
}: IMessageNavbarSectionProps) => {
  const { data: activeChatUser } = useGetChatUser(activeChatUserId);

  return (
    <div className="w-full h-16 flex items-center justify-between px-2 md:px-4 bg-background/80 backdrop-blur-md border-b border-border/40 z-50 sticky top-0">
      <Dialog>
        <DialogTrigger>
          <div className="flex-1 cursor-pointer overflow-hidden rounded-xl transition-colors hover:bg-muted/50 p-1 mr-2">
            {activeChatUser && (
              <ChatUserNavbarCard
                user={activeChatUser}
                backAction={backAction}
              />
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm p-0 overflow-hidden bg-background rounded-2xl">
          {activeChatUser && (
            <UserProfileCard user={activeChatUser} removeAction={deleteChat} />
          )}
        </DialogContent>
      </Dialog>

      <div className="flex items-center shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl shadow-lg border-border/40 p-1 bg-background/95 backdrop-blur-md"
          >
            <DropdownMenuItem
              className="text-destructive/90 focus:text-destructive focus:bg-destructive/10 gap-2.5 cursor-pointer py-2 px-2.5 rounded-lg transition-colors"
              onClick={deleteChat}
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Delete chat history</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
