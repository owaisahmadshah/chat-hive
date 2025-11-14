import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Download from "yet-another-react-lightbox/plugins/download"
import { Message } from "shared"
import MessageActions from "./MessageActions"
import { cn } from "@/lib/utils"

function MessageItem({ message }: { message: Message }) {
  const hasImage = message.photoUrl.trim() !== ""
  const [open, setOpen] = useState(false)

  return (
    <div className="relative group">
      <div className="p-2">
        {hasImage && (
          <div className="mb-2 overflow-hidden rounded-xl">
            <img
              src={message.photoUrl}
              alt="Message attachment"
              loading="lazy"
              className={cn(
                "rounded-xl cursor-pointer object-cover transition-transform duration-200",
                "hover:scale-105",
                "max-w-[75vw] max-h-[50vh]",
                "sm:max-w-[300px] sm:max-h-[300px]",
                "md:max-w-[350px] md:max-h-[350px]"
              )}
              onClick={() => setOpen(true)}
            />
          </div>
        )}

        {hasImage && (
          <Lightbox
            plugins={[Zoom, Download]}
            open={open}
            close={() => setOpen(false)}
            slides={[{ src: message.photoUrl }]}
            render={{
              buttonPrev: () => null,
              buttonNext: () => null,
            }}
          />
        )}

        {message.message && (
          <p
            className={cn(
              "whitespace-pre-wrap break-words text-sm leading-relaxed",
              hasImage ? "max-w-[250px]" : "max-w-[45vw]"
            )}
          >
            {message.message}
          </p>
        )}
      </div>

      {/* Message Actions - Shows on hover */}
      <div
        className={cn(
          "absolute -top-3 right-2 opacity-0 group-hover:opacity-100",
          "transition-all duration-200 transform scale-90 group-hover:scale-100"
        )}
      >
        <MessageActions selectedMessage={message} />
      </div>
    </div>
  )
}

export default MessageItem
