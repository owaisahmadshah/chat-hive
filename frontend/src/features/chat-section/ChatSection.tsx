import ChatNavbar from "@/features/chat-section/ChatNavBar"
import useGetUserChatsAndMessages from "@/hooks/useGetUserChatsAndMessages"
import ChatList from "./ChatList"

const ChatSection = () => {
  useGetUserChatsAndMessages()

  return (
    <div className="flex flex-col bg-background box-border max-w-[25%] max-h-[100vh] min-h-[100vh] min-w-[25vw]">
      <ChatNavbar />
      <ChatList />
    </div>
  )
}

export default ChatSection
