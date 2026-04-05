import { TUserReponse } from "shared"
import { ScrollArea } from "./ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"

interface IUserProfileCardProps {
  user: TUserReponse
  removeAction: () => Promise<void>
}

export const UserProfileCard = ({
  user,
  removeAction,
}: IUserProfileCardProps) => {
  return (
    <ScrollArea className="h-[80vh]">
      <div className="flex flex-col items-center gap-5 p-6">
        <Avatar className="w-28 h-28">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold">{user.username}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>

        <div className="w-full max-w-xs">
          <Button
            onClick={removeAction}
            variant="destructive"
            className="w-full"
          >
            Delete Chat
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}
