import { ChevronLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import correctDate from "@/lib/correct-date"
import { TUserReponse } from "shared"
import { Typing } from "@/components/Typing"

interface IChatUserNavbarCardProps {
  user: TUserReponse
  backAction?: () => void
}

export const ChatUserNavbarCard = ({
  user,
  backAction,
}: IChatUserNavbarCardProps) => {
  return (
    <div className="flex items-center gap-1 md:gap-3 h-full max-w-full">
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden h-10 w-8 px-0 hover:bg-transparent"
        onClick={(e) => {
          e.stopPropagation()
          backAction?.()
        }}
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </Button>

      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar className="w-10 h-10 border border-border/50 shrink-0">
          <AvatarImage src={user?.imageUrl} className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col truncate">
          <strong className="text-[15px] font-bold leading-tight truncate">
            {user?.username}
          </strong>
          <p className="text-[12px] leading-tight">
            {user?.isTyping ? (
              <Typing />
            ) : user?.isUserOnline ? (
              <span className="text-green-500 font-medium">online</span>
            ) : user?.updatedAt ? (
              <span className="text-muted-foreground">
                {correctDate(user.updatedAt)}
              </span>
            ) : (
              <span className="text-muted-foreground">offline</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
