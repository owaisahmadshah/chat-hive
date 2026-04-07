import { Badge } from "@/components/ui/badge"
import { Image } from "lucide-react"
import ChatActions from "./ChatActions"

interface IChatLastMessagePreviewProps {
  unreadMessages: number
  lastMessage: {
    message: string
    isPhoto: boolean
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
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0 w-6">
        {typing ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-primary font-medium">typing</span>
            <div className="flex gap-0.5">
              <span
                className="w-1 h-1 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1 h-1 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1 h-1 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
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
        ) : lastMessage.isPhoto ? (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Image className="w-3.5 h-3.5" />
            <span className="text-xs">Photo</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
            {lastMessage.message}
          </p>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ChatActions
          deleteAction={async () => deleteAction && (await deleteAction())}
        />
      </div>
    </div>
  )
}
