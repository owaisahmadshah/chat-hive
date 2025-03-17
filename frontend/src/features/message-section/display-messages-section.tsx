import { useSelector } from "react-redux"

import { ScrollArea } from "@/components/ui/scroll-area"
import { RootState } from "@/store/store"
import { Message } from "@/types/message-interface"
import correctDate from "@/lib/correct-date";

const DisplayMessagesSection = () => {

  const { selectedChat } = useSelector((state: RootState) => state.chats)
  const allMessages = useSelector((state: RootState) => state.messages)

  const user = useSelector((state: RootState) => state.user)

  const messages: Message[] = allMessages[selectedChat?._id || ""]

  function DisplayMessageOrPicture({ message }: { message: Message }) {
    return <div className="box-border inline-block m-1">
      <p className="whitespace-pre-wrap break-words w-fit p-2">
        {message.message}
      </p>
      <p className="text-[10px] ml-4">{correctDate(message.updatedAt)}</p>
    </div>
  }

  return (
    <ScrollArea className="box-border border-r border-l h-[75vh]">
      <ul className="flex flex-col gap-1 p-2 h-[75vh]">
        {
          messages.length ?
            messages.map((message: Message) => (message.sender &&
              <li key={message._id}
                className={`
                box-border border rounded-[10px] w-fit max-w-[60vw] 
                ${message.sender._id === user.userId
                    ? "self-end bg-background"
                    : "self-start bg-primary"}
              `}
              >
                <DisplayMessageOrPicture message={message} />
              </li>
            ))
            :
            <div className="flex justify-center bg-background text-foreground mb-[35vh]">
              <p className="text-lg font-medium text-muted-foreground">You don't have any messages...</p>
            </div>
        }
      </ul>
    </ScrollArea>
  )
}

export default DisplayMessagesSection
