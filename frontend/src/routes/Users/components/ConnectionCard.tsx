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

type ConnectionMode = "user" | "connection"

interface IConnectionCardProps {
  user: {
    _id: string
    username: string
    imageUrl: string
  }
  mode: ConnectionMode
  onAdd?: () => void
  onRemove?: () => void
  onMessage?: () => void
}

export const ConnectionCard = ({
  user,
  mode,
  onAdd,
  onRemove,
  onMessage,
}: IConnectionCardProps) => {
  const isConnection = mode === "connection"

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        isConnection && "w-full py-2"
      )}
    >
      <CardContent
        className={cn(
          "flex w-52 flex-col items-center gap-2 max-sm:w-36 max-sm:gap-2 max-sm:p-0",
          isConnection && "flex-row w-full justify-between"
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-center items-center",
            isConnection && "flex-row items-center"
          )}
        >
          <Avatar
            className={cn(
              "h-32 w-32 max-sm:h-24 max-sm:w-24",
              isConnection && "h-16 w-16 max-sm:h-12 max-sm:w-12"
            )}
          >
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>

          <h1 className="p-2 text-sm font-bold">{user.username}</h1>
        </div>

        <div className="flex items-center gap-2">
          {mode === "user" && onAdd && (
            <Button onClick={onAdd} size="sm">
              <UserPlus className="mr-1 h-4 w-4" />
              Connect
            </Button>
          )}

          {mode === "connection" && onRemove && (
            <Button onClick={onRemove} variant="outline" size="sm">
              <X className="mr-1 h-4 w-4" />
              Remove
            </Button>
          )}

          {onMessage && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onMessage}>
                  <MessageCircle />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create chat</TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
