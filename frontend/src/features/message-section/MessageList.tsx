import { useSelector } from "react-redux"

import { ScrollArea } from "@/components/ui/scroll-area"
import { RootState } from "@/store/store"
import { Message } from "@/types/message-interface"
import MessageItem from "./MessageItem";

const MessageList = () => {
  const { selectedChat } = useSelector((state: RootState) => state.chats)

  const allMessages = useSelector((state: RootState) => state.messages)
  const messages: Message[] = allMessages[selectedChat?._id || ""]

  const user = useSelector((state: RootState) => state.user)

  return (
    <ScrollArea className="box-border border-r border-l h-[75vh]">
      <ul className="flex flex-col gap-1 p-2 px-15 h-[75vh]">
        {
          messages.length ?
            // TODO remove message.sender && it is not necessary
            messages.map((message: Message) => (message.sender &&
              <li key={message._id}
                className={`
                box-border border rounded-[10px] w-fit max-w-[60vw] 
                ${message.sender._id === user.userId
                    ? "self-end bg-background"
                    : "self-start bg-primary"}
              `}
              >
                <MessageItem message={message} />
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

export default MessageList
