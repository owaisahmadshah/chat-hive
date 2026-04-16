import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useFetchChatUser } from "../hooks/useFetchChatUser"
import { UserProfileCard } from "@/components/UserProfileCard"
import { ChatUserNavbarCard } from "./ChatUserNavbarCard"
import { MoreVertical, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface IMessageNavbarSectionProps {
  backAction: () => void
  activeChatUserId: string
}

export const MessageNavbarSection = ({
  backAction,
  activeChatUserId,
}: IMessageNavbarSectionProps) => {
  const { data: activeChatUser } = useFetchChatUser(activeChatUserId)

  return (
    <div className="w-full h-16 flex items-center justify-between px-2 md:px-4 bg-background/95 backdrop-blur-sm border-b border-border/40 z-50">
      {/* Profile Dialog Trigger */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex-1 cursor-pointer overflow-hidden">
            <ChatUserNavbarCard user={activeChatUser} backAction={backAction} />
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl">
          <UserProfileCard user={activeChatUser} removeAction={async () => {}} />
        </DialogContent>
      </Dialog>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border/50">
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive focus:bg-destructive/10 gap-2 cursor-pointer py-2.5"
              onClick={() => { /* Handle delete chat */ }}
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Delete Chat</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}