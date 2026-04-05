import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import correctDate from "@/lib/correct-date"
import { TUserReponse } from "shared"

interface IChatUserNavbarCardProps {
  user: TUserReponse
  backAction?: () => void
}

export const ChatUserNavbarCard = ({
  user,
  backAction,
}: IChatUserNavbarCardProps) => {
  return (
    <div className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-all w-full">
      <div className="flex items-center gap-3 cursor-pointer">
        <Avatar className="w-10 h-10 ring-2 ring-background">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <strong className="text-sm font-semibold">{user.username}</strong>
          <p className="text-xs text-muted-foreground">
            {user?.isTyping ? (
              <span className="text-primary">typing...</span>
            ) : user?.isUserOnline ? (
              <span className="text-green-500">online</span>
            ) : user?.updatedAt ? (
              correctDate(user.updatedAt)
            ) : (
              "offline"
            )}
          </p>
        </div>
      </div>

      <Button
        variant="link"
        size="icon"
        className="sm:hidden text-xs uppercase cursor-pointer mr-6 underline"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation()
          backAction?.()
        }}
      >
        conversations
      </Button>
    </div>
  )
}
