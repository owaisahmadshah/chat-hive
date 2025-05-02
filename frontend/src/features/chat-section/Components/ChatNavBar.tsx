import ChatHiveLogo from "@/components/chat-hive-logo"
import CreateChat from "./CreateChat"
import ThreeDotsMenu from "./ThreeDotActions"

const ChatNavbar = () => {
  return (
    <ul className="w-[100%] h-[15vh] flex justify-between items-center p-5 bg-background border-r border-b">
      <li><ChatHiveLogo /></li>
      <li className="flex">
        <CreateChat />
        <ThreeDotsMenu />
      </li>
    </ul>
  )
}

export default ChatNavbar
