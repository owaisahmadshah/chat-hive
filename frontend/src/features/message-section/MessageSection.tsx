import { useSelector } from "react-redux"

import { RootState } from "@/store/store"
import NoChatSelected from "./components/NoChatSelected"
import MessageNavBar from "@/features/message-section/components/MessageNavBar"
import MessageList from "@/features/message-section/components/MessageList"
import MessageInput from "@/features/message-section/components/MessageInput"
import { cn } from "@/lib/utils"

const MessageSection = ({
  value,
  setValue,
}: {
  value: boolean
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { selectedChat } = useSelector((state: RootState) => state.chats)

  if (!selectedChat) {
    return <NoChatSelected />
  }

  return (
    <section className={cn("w-full hidden", value && "block", "sm:block")}>
      <MessageNavBar setValue={setValue} />
      <MessageList />
      <MessageInput />
    </section>
  )
}

export default MessageSection
