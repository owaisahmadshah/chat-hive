import correctDate from "@/lib/correct-date"
import MessageActions from "./MessageActions"
import { Message } from "@/types/message-interface"

function MessageItem({ message }: { message: Message }) {
  // TODO complete it by adding download image option or just show on the screen
  return (
    <div className="box-border inline-block m-1">
      <p className="whitespace-pre-wrap break-words w-fit p-2">{message.message}</p>
      <div className="flex justify-between items-center">
        <p className="text-[10px] ml-4">{correctDate(message.updatedAt)}</p>
        <MessageActions selectedMessage={message} />
      </div>
    </div>
  )
}

export default MessageItem