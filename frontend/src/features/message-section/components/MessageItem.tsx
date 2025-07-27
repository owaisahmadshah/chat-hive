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

  // TODO: Add zoom
  return (
    <div className="box-border inline-block m-1 relative min-w-[100px]">
      {hasImage && (
        <img
          src={message.photoUrl}
          alt={message.photoUrl}
          loading="lazy"
          className={cn(
            "rounded-md cursor-pointer object-cover bg-black",
            "max-w-[75vw] max-h-[50vh]",
            "sm:max-w-[300px] sm:max-h-[300px]",
            "md:max-w-[350px] md:max-h-[350px]"
          )}
          onClick={() => setOpen(true)}
        />
      )}
      {hasImage && (
        <Lightbox
          plugins={[Zoom, Download]}
          open={open}
          close={() => setOpen(false)}
          slides={[{ src: message.photoUrl }]}
          render={{
            buttonPrev: () => null, // hide prev button
            buttonNext: () => null, // hide next button
          }}
        />
      )}
      <p
        className={cn(
          "whitespace-pre-wrap break-words px-1 text-[15px] max-w-[45vw]",
          hasImage && "max-w-[250px] pt-2",
          /* This will make some space so our messageActions button could be seen easily */ hasImage &&
            message.message.length == 0 &&
            "py-3"
        )}
      >
        {message.message}
      </p>
      <span className={cn("absolute bottom-0 right-0")}>
        <MessageActions selectedMessage={message} />
      </span>
    </div>
  )
}

export default MessageItem
