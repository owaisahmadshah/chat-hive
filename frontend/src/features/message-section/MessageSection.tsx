import { useSelector } from "react-redux"

import { RootState } from "@/store/store"
import NoChatSelected from "./components/NoChatSelected"
import MessageNavBar from "@/features/message-section/components/MessageNavBar"
import MessageList from "@/features/message-section/components/MessageList"
import MessageInput from "@/features/message-section/components/MessageInput"

const MessageSection = () => {
  const { selectedChat } = useSelector((state: RootState) => state.chats)

  if (!selectedChat) {
    return <NoChatSelected />
  }

  return (
    <section className="w-full">
      <MessageNavBar />
      <MessageList />
      <MessageInput />
    </section>
  )
}

export default MessageSection
