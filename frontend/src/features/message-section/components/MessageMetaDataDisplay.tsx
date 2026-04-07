import correctDate from "@/lib/correct-date"
import { cn } from "@/lib/utils"
import { Message } from "shared"

interface IMessageMetaDataDisplayProps {
  message: Message
  activeChatUserId: string
}

export const MessageMetaDataDisplay = ({
  message,
  activeChatUserId,
}: IMessageMetaDataDisplayProps) => {
  return (
    <div
      className={cn(
        "flex items-center direction-reverse gap-2 px-1 animate-in fade-in slide-in-from-bottom-1 duration-200",
        message.sender._id !== activeChatUserId
          ? "self-end justify-end"
          : "self-start justify-start"
      )}
    >
      <p className="text-[10px] text-muted-foreground">
        {correctDate(message.updatedAt)}
      </p>
      {message.sender._id !== activeChatUserId && (
        <p
          className={cn(
            "text-[10px] font-medium",
            message.status === "receive" && "text-blue-500",
            message.status === "seen" && "text-green-500"
          )}
        >
          {message.status}
        </p>
      )}
    </div>
  )
}
