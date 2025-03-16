import ChatNavbar from "@/features/chat-section/chat-section-nav-bar"
import useGetUserChatsAndMessages from "@/hooks/useGetUserChatsAndMessages"
import Chats from "./chats"

const ChatSection = () => {
  useGetUserChatsAndMessages()

  return (
    <div className="flex flex-col bg-background box-border max-w-[25%] max-h-[100vh] min-h-[100vh] min-w-[25vw]">
      <ChatNavbar />
      <Chats />
    </div>
  )
}

export default ChatSection
