import { MessageCircle, UserPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface IConnectionCardProps {
  user: {
    _id: string
    username: string
    imageUrl: string
  }
  isConnection?: boolean
  addConnection?: () => void
  removeConnection?: () => void
  onMessage?: () => void
}

export const ConnectionCard = ({
  user,
  isConnection = false,
  addConnection,
  removeConnection,
  onMessage,
}: IConnectionCardProps) => {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        isConnection && "w-full"
      )}
    >
      <CardContent
        className={cn(
          "flex w-52 flex-col items-center gap-2 max-sm:w-36 max-sm:gap-2 max-sm:p-0",
          isConnection && "flex-row w-full justify-between"
        )}
      >
        <div className={cn("text-center", isConnection && "flex items-center")}>
          <Avatar
            className={cn(
              "h-32 w-32 max-sm:h-24 max-sm:w-24",
              isConnection && "h-16 w-16 max-sm:h-12 max-sm:w-12"
            )}
          >
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-sm p-2 font-bold">{user.username}</h1>
        </div>
        <div className="flex items-center gap-2">
          {addConnection && (
            <Button onClick={addConnection} variant="default" size="sm">
              <UserPlus className="mr-1 h-4 w-4" />
              Connect
            </Button>
          )}
          {removeConnection && (
            <Button onClick={removeConnection} variant="outline" size="sm">
              <X className="mr-1 h-4 w-4" />
              Remove
            </Button>
          )}
          <Button onClick={onMessage} variant="outline" size="sm">
            <Tooltip>
              <TooltipTrigger>
                {" "}
                <MessageCircle />
              </TooltipTrigger>
              <TooltipContent>Create chat</TooltipContent>
            </Tooltip>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
