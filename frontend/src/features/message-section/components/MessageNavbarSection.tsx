import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useFetchChatUser } from "../hooks/useFetchChatUser"
import { UserProfileCard } from "@/components/UserProfileCard"
import { ChatUserNavbarCard } from "./ChatUserNavbarCard"

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
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-16 min-h-16 flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm border-b border-border/40">
          <ChatUserNavbarCard user={activeChatUser} backAction={backAction} />
        </div>
      </DialogTrigger>

      <DialogContent className="flex flex-col items-center gap-6 p-6">
        <UserProfileCard user={activeChatUser} removeAction={async () => {}} />
      </DialogContent>
    </Dialog>
  )
}
