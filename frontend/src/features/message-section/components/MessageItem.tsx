import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Download from "yet-another-react-lightbox/plugins/download"
import { Check, CheckCheck } from "lucide-react"
import { format } from "date-fns"

import { Message } from "shared"
import { cn } from "@/lib/utils"
import MessageActions from "./MessageActions"

interface IMessageItemProps {
  message: Message
  activeChatUserId: string
  deleteMessage: () => Promise<unknown>
}

function MessageItem({
  message,
  activeChatUserId,
  deleteMessage,
}: IMessageItemProps) {
  const [open, setOpen] = useState(false)
  const isMe = message.sender._id !== activeChatUserId
  const hasImage = message.photoUrl && message.photoUrl.trim() !== ""

  const StatusIcon = () => {
    if (!isMe) return null
    if (message.status === "seen")
      return (
        <CheckCheck className="w-[15px] h-[15px] text-[#40c4ff] drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] stroke-[3px]" />
      )
    if (message.status === "receive")
      return <CheckCheck className="w-4 h-4 text-primary-foreground/70" />

    return <Check className="w-4 h-4 text-primary-foreground/70" />
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col max-w-[85%] md:max-w-[70%] transition-all",
        isMe ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "absolute top-0 z-20 transition-all duration-200",
          "right-1",
          "opacity-100 md:opacity-0 md:group-hover:opacity-100 sm:opacity-0"
        )}
      >
        <MessageActions
          messageText={message.message}
          deleteMessage={deleteMessage}
          isMe={isMe}
        />
      </div>

      <div
        className={cn(
          "relative overflow-hidden transition-all duration-200 shadow-sm border",
          isMe
            ? "bg-primary text-primary-foreground border-primary rounded-2xl rounded-tr-none"
            : "bg-muted/90 backdrop-blur-sm border-border/40 rounded-2xl rounded-tl-none",
          hasImage ? "p-1" : "px-3 py-1.5"
        )}
      >
        {hasImage && (
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={message.photoUrl}
              alt="Attachment"
              loading="lazy"
              className={cn(
                "cursor-pointer object-cover transition-transform duration-500 hover:scale-105",
                "w-full h-auto min-w-[200px] max-w-[300px] max-h-[400px]"
              )}
              onClick={() => setOpen(true)}
            />

            {!message.message && (
              <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
                <span className="text-[10px] text-white font-medium">
                  {format(new Date(message.updatedAt), "HH:mm")}
                </span>
                <StatusIcon />
              </div>
            )}
          </div>
        )}

        {message.message && (
          <div className={cn("relative", hasImage && "p-2")}>
            <p
              className={cn(
                "text-[14.5px] leading-[1.4] whitespace-pre-wrap break-words",
                // Extra padding right to make room for the chevron
                "pr-5",
                // Extra padding bottom to ensure text doesn't hide under absolute metadata
                "pb-1"
              )}
            >
              {message.message}
              {/* This invisible span creates space for the timestamp so text doesn't overlap it */}
              <span className="inline-block w-[65px]" />
            </p>

            <div className="absolute bottom-0 right-0 flex items-center gap-1 select-none pointer-events-none">
              <span
                className={cn(
                  "text-[10px] font-bold tabular-nums uppercase",
                  isMe ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                {format(new Date(message.updatedAt), "HH:mm")}
              </span>
              <StatusIcon />
            </div>
          </div>
        )}
      </div>

      {hasImage && (
        <Lightbox
          plugins={[Zoom, Download]}
          open={open}
          close={() => setOpen(false)}
          slides={[{ src: message.photoUrl }]}
          render={{ buttonPrev: () => null, buttonNext: () => null }}
        />
      )}
    </div>
  )
}

export default MessageItem
