import { useSelector } from "react-redux"

import { RootState } from "@/store/store"
import NoChatSelected from "./components/NoChatSelected"
import MessageNavBar from "@/features/message-section/components/MessageNavBar"
import MessageList from "@/features/message-section/components/MessageList"
import MessageInput from "@/features/message-section/components/MessageInput"

const MessageSection = () => {
  const selectedChat = useSelector((state: RootState) => state.chats.selectedChat)

  if (!selectedChat) {
    return <NoChatSelected />
  }

  return (
    <section className="min-w-[75vw]">
      <MessageNavBar />
      <MessageList />
      <MessageInput />
    </section>
  )
}

export default MessageSection
