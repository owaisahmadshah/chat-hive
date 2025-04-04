import { Download } from "lucide-react"

import correctDate from "@/lib/correct-date"
import { Message } from "@/features/message-section/types/message-interface"
import MessageActions from "./MessageActions"
import { Button } from "@/components/ui/button"

function MessageItem({ message }: { message: Message }) {
  const handleDownload = async () => {
    if (message.photoUrl.trim() === "") {
      return
    }
    // TODO: Handle download of image
  }
  const handleImageClick = () => {
    // TODO
  }

  return (
    <div className="box-border inline-block m-1">
      {message.photoUrl.trim() !== "" && (
        <div className="relative w-[250px] h-[350px] overflow-hidden rounded-lg">
          <img
            src={message.photoUrl}
            alt=""
            loading="lazy"
            className="w-full h-full object-contain bg-black cursor-pointer"
            onClick={handleImageClick}
          />
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
        className={`p-2 ${message.photoUrl !== undefined
          && message.photoUrl.trim() !== ""
          ? "max-w-[250px]"
          : "max-w-[50vw]"}`}
      >{message.message}</p>
      <div className="flex justify-between items-center">
        <p className="text-[10px] ml-4">{correctDate(message.updatedAt)}</p>
        <MessageActions selectedMessage={message} />
      </div>
    </div>
  )
}

export default MessageItem