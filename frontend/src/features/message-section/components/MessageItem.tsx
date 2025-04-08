import { Download } from "lucide-react"

import { Message } from "@/features/message-section/types/message-interface"
import MessageActions from "./MessageActions"
import { Button } from "@/components/ui/button"
import MessageImageView from "./MessageImageView"
import { cn } from "@/lib/utils"
import { saveAs } from "file-saver"

function MessageItem({ message }: { message: Message }) {
  const hasImage = message.photoUrl.trim() !== ""

  const handleDownload = async () => {
    if (!hasImage) {
      return
    }
    saveAs(message.photoUrl)
  }

  return (
    <div className="box-border inline-block m-1 relative min-w-[100px]">
      {hasImage && (
        <div className="relative">
          <MessageImageView src={message.photoUrl} />
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 cursor-pointer"
            onClick={handleDownload}
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>
      )}
      <p
        className={cn("px-1 text-[15px] max-w-[50vw]", hasImage && "max-w-[250px] pt-2", /* This will make some space so our messageActions button could be seen easily */ hasImage && message.message.length == 0 && "py-3")}
      >{message.message}</p>
      <span className={cn("absolute bottom-0 right-0",)}><MessageActions selectedMessage={message} /></span>
    </div>
  )
}

export default MessageItem