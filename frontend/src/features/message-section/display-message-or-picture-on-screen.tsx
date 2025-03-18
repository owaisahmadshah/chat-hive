import correctDate from "@/lib/correct-date"
import MessageDropDownOptions from "./selected-message-drop-down-options"
import { Message } from "@/types/message-interface"

function DisplayMessageOrPicture({ message }: { message: Message }) {
  // TODO complete it by adding download image option or just show on the screen
  return (
    <div className="box-border inline-block m-1">
      <p className="whitespace-pre-wrap break-words w-fit p-2">{message.message}</p>
      <div className="flex justify-between items-center">
        <p className="text-[10px] ml-4">{correctDate(message.updatedAt)}</p>
        <MessageDropDownOptions selectedMessage={message} />
      </div>
    </div>
  )
}

export default DisplayMessageOrPicture