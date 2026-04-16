import { Badge } from "@/components/ui/badge"
import { Image } from "lucide-react"
import ChatActions from "./ChatActions"
import { Typing } from "@/components/Typing"

interface IChatLastMessagePreviewProps {
  unreadMessages: number
  lastMessage: {
    message: string
    photoUrl?: string
  }
  typing?: {
    isTyping: boolean
  }
  deleteAction?: () => Promise<unknown>
}

export const ChatLastMessagePreview = ({
  unreadMessages,
  lastMessage,
  typing,
  deleteAction,
}: IChatLastMessagePreviewProps) => {
  const hasPhoto = lastMessage.photoUrl && lastMessage.photoUrl.length > 0

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0 w-6">
        {typing ? (
          <div className="flex items-center gap-1 text-xs">
            <Typing />
          </div>
        ) : unreadMessages > 0 ? (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="h-5 px-2 text-xs font-semibold">
              {unreadMessages}
            </Badge>
            <span className="text-xs text-primary font-medium">
              new messages
            </span>
          </div>
        ) : hasPhoto ? (
          <div className="flex items-center gap-1.5 font-medium">
            <Image className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs">
              {lastMessage.message ? lastMessage.message : "Photo"}
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
            {lastMessage.message}
          </p>
        )}
      </div>

      <div className="opacity-0 lg:group-hover:opacity-100 max-sm:opacity-100 transition-opacity flex-shrink-0">
        <ChatActions
          deleteAction={async () => deleteAction && (await deleteAction())}
        />
      </div>
    </div>
  )
}
