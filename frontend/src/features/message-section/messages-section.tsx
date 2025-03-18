import { useSelector } from "react-redux"

import { RootState } from "@/store/store"
import NoChatSelectedLandingPage from "./no-chat-selected"
import MessageSectionNavBar from "@/features/message-section/message-section-nav-bar"
import DisplayMessagesSection from "@/features/message-section/display-messages-section"
import MessagesInputSection from "@/features/message-section/messages-input-section"

const MessageSection = () => {
  const selectedChat = useSelector((state: RootState) => state.chats.selectedChat)

  if (!selectedChat) {
    return <NoChatSelectedLandingPage />
  }

  return (
    <section className="min-w-[75vw]">
      <MessageSectionNavBar />
      <DisplayMessagesSection />
      <MessagesInputSection />
    </section>
  )
}

export default MessageSection
