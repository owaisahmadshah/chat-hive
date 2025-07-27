import ChatHiveLogo from "@/components/chat-hive-logo"
import CreateChat from "./CreateChat"
import ThreeDotsMenu from "./ThreeDotActions"

const ChatNavbar = () => {
  return (
    <ul className="h-[15vh] flex justify-between items-center p-5 bg-background border-r">
      <li><ChatHiveLogo /></li>
      <li className="flex">
        <CreateChat />
        <ThreeDotsMenu />
      </li>
    </ul>
  )
}

export default ChatNavbar
